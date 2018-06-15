# cb-codegen

Code generation

## Structure
The code generation tool required three parts

* model.git: contains schema and models
* codegen2.git: contains codegen application
  * `yarn global add cb-codegen` will install codegen globally (untested)
  * `codegen generate -m path/to/models -c path/to/codegen.json` will generate the code
  * `codegen serve -m path/to/models` start a web server with the json editor
* the repository where the generation is configured and the generated code will be stored

## Development

During development of code generation logic, checkout the `codegen2.git`, apply changes there and 
execute e.g.:

```
path/to/codegen2.git/codegen_dev.sh generate \
  -m path/to/models \
  -c path/to/codegen.json
```

or (without recompiling everything)

```
path/to/codegen2.git/codegen.sh generate \ 
  -m path/to/models \
  -c path/to/codegen.json
```

There are two main locations in order to extend or change the code generation:
* `src/model-processor`: contains the pre-processing logic to transform the original mode (that can be
   edited in the model editor) to specific template-matching model
* `src/templates`: contains the templates and wrapping logic that created directories and files and calls
  the template engine

## Configuration file (codegen.json)
Since the same model can be used to generate different application parts in different locations (repositories), a configuration file is needed, that provides the generation context. This file look as following:

```json
{
  "wipeDirectories": [
    "src/test/adapters"
  ],
  "modelConfigs":[
    {
      "enabled": true,
      "model": "account/SecurityManagement.json",
      "destination": "src/test/adapters",
      "targets": [
        "ng-*"
      ],
      "config": {}
    }
  ]
}
```
