import { Environment } from 'nunjucks';
import * as _ from 'lodash';
import { TemplateFilter } from '../app/template-filter';

/**
 * Transform a string into a camel case string. See lodash documentation for details.
 */
export class CamelCaseFilter implements TemplateFilter {
  public registerFilter(env: Environment): void {
    console.log('addCamelCaseFilter');
    env.addFilter('camelCase', (str) => _.camelCase(str));
  }
}
