import { ElectronAPI } from "@electron-toolkit/preload";

interface api {
  hide: () => void;
  close: () => void;
}

declare global {
  interface Window {
    electron: ElectronAPI;
    api: api;
  }
}
