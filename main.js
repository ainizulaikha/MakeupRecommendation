const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow; // ✅ declare globally

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile("renderer/index.html");
}

ipcMain.on("open-recommendation-window", (event, filters) => {

  const recommendationWindow = new BrowserWindow({
    width: 900,
    height: 650,
    parent: mainWindow,
    modal: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  recommendationWindow.loadFile("renderer/recommendation.html");

  recommendationWindow.webContents.on("did-finish-load", () => {
    recommendationWindow.webContents.send(
      "recommendation-filters",
      filters
    );
  });

});

app.whenReady().then(createWindow);