import * as _ from 'lodash';

export class CaseUtils {
  public static pascalCase(str: string): string {
    return _.upperFirst(_.camelCase(str));
  }

  public static camelCase(str: string): string {
    return _.camelCase(str);
  }

  public static kebabCase(str: string): string {
    return _.kebabCase(str);
  }

  public static snakeCase(str: string): string {
    return _.snakeCase(str);
  }
}
