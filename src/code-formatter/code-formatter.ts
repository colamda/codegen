import { Artifact } from '../app/generator/artifact';

export interface CodeFormatter {
  formatCode(artifacts: Artifact[]): void;
}
