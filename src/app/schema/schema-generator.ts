import * as TJS from 'typescript-json-schema';
import { Logger } from '@codebalancers/logging';
import { LangUtils } from '@codebalancers/commons';
import { FileUtils } from '../utils/file.utils';

// optionally pass argument to schema generator
const settings: TJS.PartialArgs = {
  required: true,
  validationKeywords: [
    'title',
    'headerTemplate',
    'watch',
    'enumSource',
    'options',
    'media',
    'basicCategoryTitle',
    'template',
    'minLength',
    'maxLength',
    'pattern',
    'minimum',
    'maximum',
    'exclusiveMinimum',
    'exclusiveMaximum',
    'multipleOf',
    'minProperties',
    'maxProperties',
    'minItems',
    'maxItems',
    'uniqueItems'
  ]
};

// optionally pass ts compiler options
const compilerOptions: TJS.CompilerOptions = {
  strictNullChecks: false
};

export function startSchemaGeneration(filePath: string, outPath: string): void {
  const logger = new Logger('schema generator');
  logger.info('start generation');

  const program = TJS.getProgramFromFiles([filePath], compilerOptions);
  const schema = TJS.generateSchema(program, 'Model', settings);

  if (LangUtils.isUndefined(outPath)) {
    console.log('----------------------------------');
    console.log(JSON.stringify(schema));
    console.log('----------------------------------');
  } else {
    FileUtils.writeFile(outPath, JSON.stringify(schema, null, 2));
  }

  logger.info('done generation');
}
