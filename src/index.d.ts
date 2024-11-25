/* Copyright (c) 2021-2024 Damon Smith */

declare module '*.svg';
declare module '*.png';
declare module '*.woff2';
declare module '*.js';


/// <reference types="vite/client" />

interface Window {
  // expose in the `electron/preload/index.ts`
  ipcRenderer: import('electron').IpcRenderer
}
