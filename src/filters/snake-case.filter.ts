import { Environment } from 'nunjucks';
import * as _ from 'lodash';
import { TemplateFilter } from '../app/template-filter';

/**
 * Transform a string into a snake case string. See lodash documentation for details.
 */
export class SnakeCaseFilter implements TemplateFilter {
  public registerFilter(env: Environment): void {
    console.log('addSnakeCaseFilter');
    env.addFilter('snakeCase', (str) => _.snakeCase(str));
  }
}
