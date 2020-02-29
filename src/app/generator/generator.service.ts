import { CodegenConfig, CodegenModelConfiguration } from './condegen';
import { ModelProcessor } from '../../model-processor/model-processor';
import { lstatSync, readFileSync } from 'fs';
import * as _path from 'path';
import { FileUtils } from '../utils/file.utils';
import * as rimraf from 'rimraf';
import { Artifact } from './artifact';
import { LangUtils, StringUtils } from '@codebalancers/commons';
import { Logger } from '@codebalancers/logging';
import * as Ajv from 'ajv';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export class GeneratorService {
  private logger = new Logger('GeneratorService');
  private ajv: any;

  /**
   *
   * @param {ModelProcessor[]} modelProcessors all model processors that are considered (but not necessarily used) for generation
   */
  constructor(private modelProcessors: ModelProcessor[]) {
    this.ajv = new Ajv({
      // meta: true,
      // extendRefs: true,
      // allErrors: true,
      unknownFormats: 'ignore',
      logger: false
    } as any);

    this.ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
  }

  /**
   * @param {string} modelDirPath absolute path to directory with all models
   * @param {string} configFilePath absolute path to codegen config file
   */
  public generate(
    modelDirPath: string,
    configFilePath: string
  ): Observable<Artifact>[] {
    this.logger.info('generate', modelDirPath, configFilePath);

    const artifacts: Observable<Artifact>[] = [];

    const codegenConfig: CodegenConfig = this.readConfigFile(configFilePath);
    this.wipeDirectories(codegenConfig.wipeDirectories);

    const schema = this.readSchemaFromModelDir(modelDirPath);

    codegenConfig.modelConfigs.forEach(config => {
      this.logger.debug('process modelConfig');

      const model: {} = this.readModelFromModelDir(modelDirPath, config.model);

      const valid = this.validateModel(model, schema);
      if (!valid) {
        this.logger.error('skip model', config.model);
        return;
      }

      this.modelProcessors
        .filter(mp => this.testProcessorMatches(mp, config.targets))
        .forEach(mp => {
          try {
            const res = mp.process(model, config.destination, config.config);
            artifacts.push(...res);
          } catch (e) {
            this.logger.error('error when running model processor', mp.type, e);
          }
        });
    });

    return artifacts.map(o =>
      o.pipe(
        catchError(err => {
          this.logger.error('error when running model processor', err);
          return of(null);
        })
      )
    );
  }

  /**
   * Read the file into a CodegenConfig object, removes all model configuration that will not be executed and adjust
   * all paths to be absolute.
   *
   * @param {string} configFilePath path to config file
   * @returns {CodegenConfig} read
   */
  private readConfigFile(configFilePath: string): CodegenConfig {
    this.logger.info('read config file', configFilePath);

    if (!lstatSync(configFilePath).isFile()) {
      this.logger.error('could not find config file', configFilePath);
      return { wipeDirectories: [], modelConfigs: [] };
    }

    const configFile = readFileSync(configFilePath, 'utf-8');
    const configFileDir = _path.dirname(configFilePath);
    const codegenConfig: CodegenConfig = JSON.parse(configFile);

    // -- ensure list for configs
    if (LangUtils.isUndefined(codegenConfig.modelConfigs)) {
      codegenConfig.modelConfigs = [];
    }

    // -- ensure list for directories
    if (LangUtils.isUndefined(codegenConfig.wipeDirectories)) {
      codegenConfig.wipeDirectories = [];
    }

    // -- remove disabled and invalid configs and adjust destination path
    codegenConfig.modelConfigs = codegenConfig.modelConfigs
      .filter(config => {
        const ret = config.enabled === true;
        if (ret === false) {
          this.logger.warn('remove config that is not enabled', config);
        }
        return ret;
      })
      .filter(config => {
        const ret =
          StringUtils.isNotBlank(config.model) &&
          StringUtils.isNotBlank(config.destination);
        if (ret === false) {
          this.logger.warn(
            'remove config that misses "model" or "path" field',
            config
          );
        }
        return ret;
      })
      .map(config => this.makeDestinationPathAbsolute(configFileDir, config));

    // -- adjust wipe paths
    codegenConfig.wipeDirectories = codegenConfig.wipeDirectories.map(
      wipePath => FileUtils.getAbsolutePath(configFileDir, wipePath)
    );

    return codegenConfig;
  }

  /**
   * Read the requested model from the model directory
   *
   * @param {string} modelDirPath absolute path to directory with all models
   * @param {string} requestedModel relative path inside model directory to requested model
   * @returns {{}} the requested model as object
   */
  private readModelFromModelDir(
    modelDirPath: string,
    requestedModel: string
  ): {} {
    const path = _path.join(modelDirPath, requestedModel);
    this.logger.info('read model', path);
    const model1String = readFileSync(path, 'utf-8');
    return JSON.parse(model1String);
  }

  private readSchemaFromModelDir(modelDirPath: string): {} {
    const path = _path.join(modelDirPath, 'schema.json');
    this.logger.info('read schema', path);
    const schema = readFileSync(path, 'utf-8') as string;
    return JSON.parse(schema);
  }

  /**
   * Translate the (potentially relative) target base path to an absolute path.
   *
   * @param {string} configFilePath path of directory where config file resides
   * @param {CodegenConfig} config the actual configuration
   * @returns {CodegenConfig} the changes configuration
   */
  private makeDestinationPathAbsolute(
    configFilePath: string,
    config: CodegenModelConfiguration
  ): CodegenModelConfiguration {
    config.destination = FileUtils.getAbsolutePath(
      configFilePath,
      config.destination
    );
    return config;
  }

  /**
   * Test if the processor shall be called. This is true of the type of the processor is covered by at least one of the target.
   *
   * @param {ModelProcessor} mp processor that is tested
   * @param {string[]} targets wildcard-enabled targets
   * @returns {boolean} true if specified processor shall be called
   */
  private testProcessorMatches(mp: ModelProcessor, targets: string[]): boolean {
    // if one target covers the type the processor shall be used
    return LangUtils.isDefined(
      targets.find(target => this.matches(mp.type, target))
    );
  }

  /**
   * Test weather value matches the wildcard string:
   *
   * @param {string} value
   * @param {string} wildcardString
   * @return {boolean}
   */
  private matches(value: string, wildcardString: string): boolean {
    return new RegExp('^' + wildcardString.split('*').join('.*') + '$').test(
      value
    );
  }

  /**
   * Wipe the specified directories.
   *
   * @param {string[]} wipeDirectories list of directories that are wiped
   */
  private wipeDirectories(wipeDirectories: string[]): void {
    wipeDirectories.forEach(dir => {
      this.logger.info('wipe directory', dir);
      rimraf.sync(dir);
    });
  }

  private validateModel(model: {}, schema: {}): boolean {
    const validate = this.ajv.compile(schema);
    const valid = validate(model);

    if (!valid) {
      this.logger.error('model is not valid', validate.errors);
    }

    return valid;
  }
}
