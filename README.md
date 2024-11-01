<p align="center">
  <img src="assets/icon.png" alt="Vue/Nuxt Declaration Navigator Icon" width="200"/>
</p>

# Vue/Nuxt Declaration Navigator

A VSCode extension for navigating `*.d.ts` files, designed to enhance Nuxt projects by auto-locating and navigating to auto-imported components and functions.

## Motivation

The goal of this extension is to cover all Nuxt/Nitro related imports. We aim to integrate these features into the official Vue extension (`Vue.volar`).

## Features

- **Auto-locate and navigate to auto-imported components and functions in Nuxt projects:**
  - Instead of navigating to `.nuxt/components.d.ts`, it will find the actual component for you.
  - Supports built-in components such as `Head`, `Script`, and `NuxtLoadingIndicator`.

- **Auto-locate custom definitions like custom plugins:**
  - For example, if you have an `index.d.ts` file for your own definitions:

    ```typescript
    import type { IDialogPlugin } from "./types/DialogPlugin";

    declare module '#app' {
        interface NuxtApp {
            $dialog: IDialogPlugin,
        }
    }

    export {}
    ```

  - And you're using it like this:

    ```typescript
    const { $dialog } = useNuxtApp();
    ```

  - This extension will help you find the definition for `$dialog` as well.


## Configuration

We recommend to set `editor.gotoLocation.multipleDefinitions` to `goto` for better experience. By this, it will automatically navigate to the file.

<p align="center">
  <img src="assets/prompt.png" alt="" />
</p>