export enum ArtifactType {
  TYPESCRIPT,
  JAVA
}

/**
 * Description of an artifact (code file) that already has been created.
 */
export class Artifact {
  /**
   *
   * @param {string} file absolute path to file
   * @param {ArtifactType} type code type
   * @param {boolean} formatted true if the code has been formatted
   */
  constructor(public file: string,
              public type: ArtifactType,
              public formatted = false) {
  }
}
