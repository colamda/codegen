import { Artifact } from '../app/generator/artifact';
import { Observable } from 'rxjs/Observable';

/**
 * A ModelProcessor takes a model and translates the model to one ore more target models and calls one or more generators that do the
 * actual code generation.
 */
export interface ModelProcessor {
  /**
   * Unique type of the processor that can be specified in the codegen config in the 'targets' in order to request a certain processor.
   */
  type: string;

  /**
   *
   * @param model fitting to template
   * @param {string} targetBasePath base path where the generated code shall be stored
   * @param config generic config that can be used to control the model processor and the generator
   */
  process(model: any, targetBasePath: string, config: {} | null | undefined): Observable<Artifact>[];
}
