// Fixed: Removed the triple-slash reference to vite/client to resolve the "Cannot find type definition file" error.
// The file manually defines NodeJS.ProcessEnv and ImportMeta to provide type safety for the environment variables used.

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
