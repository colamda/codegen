import { Environment } from 'nunjucks';

/**
 * Interface for all instances that implement a filter.
 */
export interface TemplateFilter {
  /**
   * Register a new filter in the specified environment.
   *
   * @param {Environment} env of the template engine
   */
  registerFilter(env: Environment): void;
}
