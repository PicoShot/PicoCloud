import { app, shell, BrowserWindow, ipcMain, Menu, Tray } from "electron";
import { autoUpdater } from "electron-updater";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";
import trayIcon from "../../resources/tray-icon.png?asset";

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isShowing: boolean = true;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    title: "PicoCloud",
    minHeight: 500,
    minWidth: 850,
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    icon: icon,
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow?.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

ipcMain.on("hide", () => {
  mainWindow?.minimize();
});

ipcMain.on("close", () => {
  isShowing = false;
  mainWindow?.hide();
});

ipcMain.on("restart_app", () => {
  autoUpdater.quitAndInstall();
});

app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.picoshot");

  autoUpdater.checkForUpdatesAndNotify();

  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  autoUpdater.autoDownload = true;

  autoUpdater.on("update-available", () => {
    mainWindow?.webContents.send("update_available");
  });

  autoUpdater.on("update-downloaded", () => {
    mainWindow?.webContents.send("update_downloaded");
  });

  autoUpdater.on("error", (error) => {
    mainWindow?.webContents.send("update_error", error.message);
  });

  tray = new Tray(trayIcon);
  const contextMenu = Menu.buildFromTemplate([
    {
      icon: trayIcon,
      label: "PicoCloud",
      enabled: false,
      click: () => {
        isShowing = true;
        mainWindow?.show();
        mainWindow?.setSkipTaskbar(false);
      },
    },
    {
      type: "separator",
    },
    {
      label: "Check for Updates...",
      click: () => {
        autoUpdater.checkForUpdatesAndNotify();
      },
    },
    {
      label: "Bugs Report",
      click: () => {},
    },
    {
      type: "separator",
    },
    { label: "Quit PicoCloud", click: () => app.exit() },
  ]);

  tray.setToolTip("PicoCloud");
  tray.setContextMenu(contextMenu);
  tray.on("click", () => {
    if (isShowing) {
      isShowing = false;
      mainWindow?.hide();
    } else {
      isShowing = true;
      mainWindow?.show();
      mainWindow?.setSkipTaskbar(false);
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
