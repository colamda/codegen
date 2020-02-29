import * as _path from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import { StringUtils } from '@codebalancers/commons';

export class FileUtils {
  public static getAbsolutePath(currentPath: string, path: string): string {
    if (StringUtils.isBlank(path)) {
      return null;
    }

    if (path.startsWith('/')) {
      return path;
    } else {
      return _path.join(currentPath, path);
    }
  }

  public static mkdirParent(dir: string, mode?: number | string | null): void {
    console.log('mkdirParent', dir);

    try {
      mkdirSync(dir, mode);
    } catch (e) {
      if (e.code === 'ENOENT') {
        FileUtils.mkdirParent(_path.dirname(dir), mode);
        FileUtils.mkdirParent(dir, mode);
      }
    }
  }

  public static writeFile(
    targetFilePath: string,
    contents: string,
    createDir = false
  ): void {
    if (createDir) {
      const dir = _path.dirname(targetFilePath);
      this.mkdirParent(dir);
    }

    console.log('write file', targetFilePath);
    writeFileSync(targetFilePath, contents);
  }
}
