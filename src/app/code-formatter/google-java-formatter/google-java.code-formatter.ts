import * as child_process from 'child_process';
import { Artifact, ArtifactType } from '../../generator/artifact';
import * as _path from 'path';
import { StringUtils } from '@codebalancers/commons';

export class GoogleJavaCodeFormatter {
  public formatCode(artifacts: Artifact[]): void {
    const fileList = artifacts
      .filter(artifact => artifact.type === ArtifactType.JAVA)
      .map(artifact => {
        artifact.formatted = true;
        return artifact.file;
      })
      .join(' ');

    if (StringUtils.isBlank(fileList)) {
      return;
    }

    const jar = _path.resolve(__dirname, 'google-java-format-1.5-all-deps.jar');

    const cmd = `java -jar ${jar} --aosp --replace ${fileList}`;
    console.log('run google code formatter', cmd);

    const res = child_process.execSync(cmd);
  }
}
