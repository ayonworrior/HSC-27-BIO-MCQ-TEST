
declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
  }
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
