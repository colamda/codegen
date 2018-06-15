import { GoogleJavaCodeFormatter } from './google-java-formatter/google-java.code-formatter';
import { Artifact } from '../generator/artifact';

export class CodeFormatter {
  private googleFormatter = new GoogleJavaCodeFormatter();

  public formatCode(artifacts: Artifact[]): void {
    this.googleFormatter.formatCode(artifacts);
  }
}
