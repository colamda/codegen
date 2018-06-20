import * as yargs from 'yargs';
import { lstatSync } from 'fs';
import './rxjs-operators';
import { startServer } from './server/server';
import { startGeneration } from './generator/generator';
import { FileUtils } from './utils/file.utils';
import { Logger, LoggingBackend } from '@codebalancers/logging';
import { TerminalAppender } from '@codebalancers/logging/cb-logging/terminal.appender';
import { startSchemaGeneration } from './schema/schema-generator';

LoggingBackend.appenders.push(new TerminalAppender());
const logger = new Logger('main');

/**
 * The app can be called with one or multiple configuration parameters. Therefore, we transforms the specified parameter
 * (which can be either an array or just one single one) into an array.
 *
 * @param c config parameter(s), either array or singular
 * @returns {string[]} array of configs
 */
function configs(c: any): string[] {
  if (c instanceof Array) {
    return c.map(filePath => FileUtils.getAbsolutePath(process.cwd(), filePath));
  } else {
    return [ FileUtils.getAbsolutePath(process.cwd(), c) ];
  }
}

/**
 * Check weather specified directory with models exists.
 *
 * @param {string} dir absolute path to directory
 * @returns {boolean} true if directory exists
 */
function checkModelDir(dir: string): boolean {
  if (!lstatSync(dir).isDirectory()) {
    console.error('model directory does not exist at: ', dir);
    return false;
  }

  return true;
}

const argv = yargs
  .usage('Usage: $0 <command> [options]')
  .command('serve', 'Start model editor server',
    y => {
      return y
        .alias('m', 'modelDir')
        .describe('m', 'directory with models')
        .nargs('m', 1)

        .option('p', {
          alias: 'port',
          default: 3100,
          describe: 'server port'
        })

        .demandOption([ 'm' ]);
    },
    y => {
      logger.info('serve');
      const directoryPath = FileUtils.getAbsolutePath(process.cwd(), y.modelDir);
      if (checkModelDir(directoryPath)) {
        startServer(y.port, directoryPath);
      }
    })
  .command('generate', 'Generate code',
    y => {
      return y
        .alias('m', 'modelDir')
        .describe('m', 'directory with models')
        .nargs('m', 1)

        .alias('f', 'filters')
        .describe('f', 'file with filter index')
        .nargs('f', 1)

        .alias('mp', 'modelProcessors')
        .describe('mp', 'file with processor index')
        .nargs('mp', 1)

        .alias('cf', 'codeFormatters')
        .describe('cf', 'file with formatters index')
        .nargs('cf', 1)

        .alias('c', 'config')
        .describe('c', 'generation config file')

        .demandOption([ 'm', 'c', 'mp' ]);
    },
    y => {
      logger.info('generate');
      const directoryPath = FileUtils.getAbsolutePath(process.cwd(), y.modelDir);
      const filterPath = FileUtils.getAbsolutePath(process.cwd(), y.filters);
      const processorIndexPath = FileUtils.getAbsolutePath(process.cwd(), y.modelProcessors);
      const formatterIndexPath = FileUtils.getAbsolutePath(process.cwd(), y.codeFormatters);

      if (checkModelDir(directoryPath)) {
        startGeneration(directoryPath, configs(y.config), filterPath, processorIndexPath, formatterIndexPath);
      }
    })
  .command('schema:generate', 'Generate json schema from TS interfaces',
    y => {
      return y
        .alias('s', 'schema')
        .describe('s', 'file with schema description')
        .nargs('s', 1)

        .alias('o', 'out')
        .describe('o', 'path to file where schema is written')
        .nargs('o', 1)

        .demandOption([ 's' ]);
    },
    y => {
      logger.info('generate schema');
      const schemaPath = FileUtils.getAbsolutePath(process.cwd(), y.schema);
      const outPath = FileUtils.getAbsolutePath(process.cwd(), y.out);
      startSchemaGeneration(schemaPath, outPath);
    })

  .demandCommand(1)

  .example('$0 generate -m path/to/models/ -c config-1.json -c config-2.json', 'generation based on two models')
  .example('$0 serve -m path/to/models/', 'start model editor')

  .help('h')
  .alias('h', 'help')
  .epilog('copyright 2018 codebalancers')
  .argv;

logger.info('done');
