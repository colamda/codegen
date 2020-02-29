import { Environment } from 'nunjucks';
import { TemplateFilter } from '../app/template-filter';
import { CaseUtils } from '../app/utils/case.utils';

/**
 * Transform a string into a pascal case string (like camel case but with first char to be capital).
 */
export class PascalCaseFilter implements TemplateFilter {
  public registerFilter(env: Environment): void {
    console.log('add pascal case filter');
    env.addFilter('pascalCase', str => CaseUtils.pascalCase(str));
  }
}
