import * as TJS from 'typescript-json-schema';
import { Logger } from '@codebalancers/logging';

// optionally pass argument to schema generator
const settings: TJS.PartialArgs = {
  required: true,
  validationKeywords: [ 'title', 'headerTemplate' ]
};

// optionally pass ts compiler options
const compilerOptions: TJS.CompilerOptions = {
  strictNullChecks: false
};

export function startSchemaGeneration(filePath: string): void {
  const logger = new Logger('schema generator');
  logger.info('start generation');

  const program = TJS.getProgramFromFiles([ filePath ], compilerOptions);
  const schema = TJS.generateSchema(program, 'Model', settings);

  console.log('----------------------------------');
  console.log(JSON.stringify(schema));
  console.log('----------------------------------');

  logger.info('done generation');
}
