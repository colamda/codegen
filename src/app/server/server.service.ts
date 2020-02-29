import { lstatSync, readdirSync } from 'fs';
import * as _path from 'path';
import * as _ from 'lodash';

export interface ModelEntry {
  module: string;
  filename: string;
  date: string;
  size: number;
}

export class ServerService {
  public getModels(modelPath: string): ModelEntry[] {
    const ret: ModelEntry[] = [];

    readdirSync(modelPath)
      .filter(dir => lstatSync(_path.join(modelPath, dir)).isDirectory())
      .forEach(dir => {
        readdirSync(_path.join(modelPath, dir))
          .filter(file => lstatSync(_path.join(modelPath, dir, file)).isFile())
          .filter(file => _.endsWith(file, '.json'))
          .forEach(file => {
            const stat = lstatSync(_path.join(modelPath, dir, file));

            ret.push({
              module: dir,
              filename: file,
              date: stat.mtime.toISOString(),
              size: stat.size
            });
          });
      });

    return ret;
  }
}
