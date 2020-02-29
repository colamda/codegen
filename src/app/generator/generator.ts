import * as nunjucks from 'nunjucks';
import { GeneratorService } from './generator.service';
import { filterIndex } from '../../filters';
import { Artifact } from './artifact';
import { CodeFormatter } from '../../code-formatter/code-formatter';
import { TemplateFilter } from '../template-filter';
import { LangUtils } from '@codebalancers/commons';
import { existsSync, lstatSync } from 'fs';
import { ModelProcessor } from '../../model-processor/model-processor';
import { Logger } from '@codebalancers/logging';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export function startGeneration(
  filePath: string,
  configFiles: string[],
  filterIndexPath: string,
  processorIndexPath: string,
  formatterIndexPath: string
): void {
  const logger = new Logger('startGeneration');

  logger.info('startGeneration for', filePath, configFiles);

  const env = nunjucks.configure({
    autoescape: false,
    trimBlocks: true,
    lstripBlocks: true
  });

  // register configured filters
  if (
    LangUtils.isDefined(filterIndexPath) &&
    existsSync(filterIndexPath) &&
    lstatSync(filterIndexPath).isFile()
  ) {
    logger.info('add configured filters');
    (require(filterIndexPath).filterIndex as TemplateFilter[]).forEach(filter =>
      filter.registerFilter(env)
    );
  } else {
    logger.info(
      'filterIndexPath was not configured to an existing path',
      filterIndexPath
    );
  }

  // register build in filters
  logger.info('add build-in filters');
  filterIndex.forEach(filter => filter.registerFilter(env));

  // register configured filters
  let processorIndex: ModelProcessor[];
  if (
    existsSync(processorIndexPath) &&
    lstatSync(processorIndexPath).isFile()
  ) {
    processorIndex = require(processorIndexPath).processorIndex;
  } else {
    logger.error('processorIndexPath not found', processorIndexPath);
    return;
  }

  const artifactsObservables: Observable<Artifact>[] = [];

  // -- process all config files
  configFiles.forEach(cf => {
    logger.info('handle ', cf);
    const a = new GeneratorService(processorIndex).generate(filePath, cf);
    artifactsObservables.push(...a);
  });

  // -- execute the collected observables; remove all resulting artifacts that are undefined
  forkJoin(artifactsObservables)
    .pipe(map(artifacts => artifacts.filter(a => LangUtils.isDefined(a))))
    .subscribe((artifacts: Artifact[]) => {
      // call code formatter
      if (
        LangUtils.isDefined(formatterIndexPath) &&
        existsSync(formatterIndexPath) &&
        lstatSync(formatterIndexPath).isFile()
      ) {
        logger.info('run code formatters');
        (require(formatterIndexPath)
          .formatterIndex as CodeFormatter[]).forEach(f =>
          f.formatCode(
            artifacts.filter(artifact => artifact.formatted === false)
          )
        );
      } else {
        logger.info(
          'formatterIndexPath was not configured to an existing path',
          formatterIndexPath
        );
      }
    });
}
