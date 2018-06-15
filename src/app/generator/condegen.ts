export interface CodegenModelConfiguration {
  /**
   * Enable this config for code generation. If set to false, the config will be ignored.
   */
  enabled: boolean;

  /**
   * Path to the model inside the model directory.
   */
  model: string;

  /**
   * Target base path where the code will be written to.
   */
  destination: string;

  /**
   * Delete all files in the specified 'path' before the generation starts.
   */
  wipeDestination: boolean;

  /**
   * Model processors that will be called.
   */
  targets: string[];

  /**
   * Generic config that can be used to control the model processor and the generator.
   */
  config: {};
}

export interface CodegenConfig {
  /**
   * List of directories that shall be wiped during beginning of code generation process.
   */
  wipeDirectories: string[];

  /**
   * List of configurations that will be handled.
   */
  modelConfigs: CodegenModelConfiguration[];
}
