import { Environment } from 'nunjucks';
import * as _ from 'lodash';
import { TemplateFilter } from '../app/template-filter';

/**
 * Transform a string into a kebab case string. See lodash documentation for details.
 */
export class KebabCaseFilter implements TemplateFilter {
  public registerFilter(env: Environment): void {
    console.log('addKebabCaseFilter');
    env.addFilter('kebabCase', str => _.kebabCase(str));
  }
}
