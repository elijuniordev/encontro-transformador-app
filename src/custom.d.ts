// src/custom.d.ts
declare module 'file-saver' {
  // Trocamos 'any' por 'unknown' para resolver o aviso do linter
  export function saveAs(data: Blob, filename: string, options?: unknown): void;
}