import * as nunjucks from 'nunjucks';
import { GeneratorService } from './generator.service';
import { filterIndex } from '../../filters';
import { processorIndex } from '../../model-processor';
import { Artifact } from './artifact';
import { Observable } from 'rxjs/Observable';
import { CodeFormatter } from '../code-formatter/code-formatter';

export function startGeneration(filePath: string, configFiles: string[]): void {
  const codeFormatter = new CodeFormatter();

  console.log('startGeneration for', filePath, configFiles);

  const env = nunjucks.configure({
    autoescape: false,
    trimBlocks: true,
    lstripBlocks: true
  });

  // register all filters
  filterIndex.forEach(filter => filter.registerFilter(env));

  const artifactsObservables: Observable<Artifact>[] = [];

  // -- process all config files
  configFiles.forEach(cf => {
    console.log('handle ', cf);
    const a = new GeneratorService(processorIndex).generate(filePath, cf);
    artifactsObservables.push(...a);
  });

  Observable
    .forkJoin(artifactsObservables)
    .subscribe((artifacts: Artifact[]) => {
      // remove already formatted artifacts
      const files = artifacts.filter(artifact => artifact.formatted === false);

      // call code formatter
      codeFormatter.formatCode(files);
    });
}
