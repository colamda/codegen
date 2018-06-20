import * as TJS from 'typescript-json-schema';
import { Logger } from '@codebalancers/logging';
import { LangUtils } from '@codebalancers/commons';
import { FileUtils } from '../utils/file.utils';

// optionally pass argument to schema generator
const settings: TJS.PartialArgs = {
  required: true,
  validationKeywords: [ 'title', 'headerTemplate', 'watch', 'enumSource' ]
};

// optionally pass ts compiler options
const compilerOptions: TJS.CompilerOptions = {
  strictNullChecks: false
};

export function startSchemaGeneration(filePath: string, outPath: string): void {
  const logger = new Logger('schema generator');
  logger.info('start generation');

  const program = TJS.getProgramFromFiles([ filePath ], compilerOptions);
  const schema = TJS.generateSchema(program, 'Model', settings);

  const schemaString = JSON.stringify(schema);

  if (LangUtils.isUndefined(outPath)) {
    console.log('----------------------------------');
    console.log(schemaString);
    console.log('----------------------------------');
  } else {
    FileUtils.writeFile(outPath, schemaString);
  }

  logger.info('done generation');
}
