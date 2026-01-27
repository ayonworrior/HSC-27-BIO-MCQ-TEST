
/// <reference types="vite/client" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly API_KEY: string;
  }
}

interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
