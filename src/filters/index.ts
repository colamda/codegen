import { TemplateFilter } from '../app/template-filter';
import { CamelCaseFilter } from './camel-case.filter';
import { PascalCaseFilter } from './pascal-case.filter';

// -- all filters that shall be available must be registered here
export const filterIndex: TemplateFilter[] = [
  new CamelCaseFilter(),
  new PascalCaseFilter()
];
