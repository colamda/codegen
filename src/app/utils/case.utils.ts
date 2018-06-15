import * as _ from 'lodash';

export class CaseUtils {
  public static pascalCase(str: string): string {
    return _.upperFirst(_.camelCase(str));
  }

  public static camelCase(str: string): string {
    return _.camelCase(str);
  }
}
