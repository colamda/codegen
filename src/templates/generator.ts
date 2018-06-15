import { Artifact } from '../app/generator/artifact';

/**
 * A generator uses a model and a template to generate one single file within the specified target path. The used template is a property
 * of the generator.
 */
export interface Generator {
  /**
   * Generate the file. The file can also be written in a sub-path of the specified targetBasePath.
   *
   * @param model used model to fill the template
   * @param {string} targetBasePath path where the generated file is stored
   */
  generate(model: any, targetBasePath: string): Artifact;
}
