import { ModelProcessor } from './model-processor';
import { NgRestAdapterModelProcessor } from './ng-rest-adapter/ng-rest-adapter.model-processor';
import { JavaRestFacadeModelProcessor } from './java-rest-facade/java-rest-facade.model-processor';
import { NgCrudAdapterModelProcessor } from './ng-crud-adapter/ng-crud-adapter.model-processor';
import { NgDtoEditorModelProcessor } from './ng-dto-editor/ng-dto-editor.model-processor';

// -- all processors that shall be available must be registered here
export const processorIndex: ModelProcessor[] = [
  new NgRestAdapterModelProcessor(),
  new JavaRestFacadeModelProcessor(),
  new NgCrudAdapterModelProcessor(),
  new NgDtoEditorModelProcessor()
];
