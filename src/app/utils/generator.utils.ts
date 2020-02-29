import * as nunjucks from 'nunjucks';
import { readFileSync, writeFileSync } from 'fs';
import * as _path from 'path';
import { FileUtils } from './file.utils';
import { LangUtils } from '@codebalancers/commons';

export class GeneratorUtils {
  /**
   * Generate and write the output as file. Required directories will be created. Existing file will be
   * overwritten.
   *
   * @param {string} templateFilePath absolute path to template file
   * @param {string} targetFilePath absolute path to target file
   * @param {any} model
   * @param postProcessing callback e.g. to format the generated code
   */
  public static generateAndWrite(
    templateFilePath: string,
    targetFilePath: string,
    model: any,
    postProcessing?: (result: string) => string
  ): void {
    const tpl = readFileSync(templateFilePath, 'utf8');
    let result = nunjucks.renderString(tpl, model);

    if (LangUtils.isDefined(postProcessing)) {
      result = postProcessing(result);
    }

    const dir = _path.dirname(targetFilePath);
    FileUtils.mkdirParent(dir);

    console.log('write generated file', targetFilePath);
    writeFileSync(targetFilePath, result);
  }
}
