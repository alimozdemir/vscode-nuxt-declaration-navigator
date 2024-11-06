import { NuxtLayout } from "../types/nuxt";
import { fileExists, folderExists, getFiles, joinPath, resolvePath } from "../utils/file";
import { nuxtLayoutPathToKey } from "../utils/nuxt";
import { NuxtConfigParser } from "./nuxt.config.parser";

export class NuxtProject {
  version: 3 | 4 = 3;

  // extends of the project
  extends: NuxtProject[] = [];

  // path of layouts
  layouts: NuxtLayout[] = [];

  private nuxtConfig?: NuxtConfigParser;

  constructor(private nuxtPath: string) {
  }

  async run() : Promise<boolean> {
    // main entry point
    const configFile = joinPath(this.nuxtPath, 'nuxt.config.ts');

    if (!await fileExists(configFile)) {
      return false;
    }

    this.nuxtConfig = new NuxtConfigParser(configFile);

    await this.nuxtConfig.parse();

    await this.findLayouts();

    for (const extend of this.nuxtConfig.extends) {
      const path = resolvePath(this.nuxtPath, extend);
      const nuxtProject = new NuxtProject(path);
      if (await nuxtProject.run())
        this.extends.push(nuxtProject);
    }

    return true;
  }

  private async findLayouts() {
    if (!this.nuxtConfig) return;

    let path = '/layouts';

    if (this.nuxtConfig.version == 4) {
      path = '/app/layouts';
    }

    path = joinPath(this.nuxtPath, path);

    if (!await folderExists(path))
      return;

    const files = await getFiles(path, '.vue');

    for (const file of files) {
      this.layouts.push({
        key: nuxtLayoutPathToKey(file.replace(path, '')),
        path: file
      });
    }

    console.log(this.layouts)
  }

}