import { resolve } from "path";
import * as TJS from "typescript-json-schema";

// optionally pass argument to schema generator
const settings: TJS.PartialArgs = {
  required: true,
  validationKeywords: [ "title", "headerTemplate" ]
};

// optionally pass ts compiler options
const compilerOptions: TJS.CompilerOptions = {
  strictNullChecks: false
};

// optionally pass a base path
const basePath = __dirname;

const program = TJS.getProgramFromFiles([ resolve(basePath, "model.ts") ], compilerOptions, basePath);

// We can either get the schema for one file and one type...
const schema = TJS.generateSchema(program, "Model", settings);

console.log(JSON.stringify(schema));
