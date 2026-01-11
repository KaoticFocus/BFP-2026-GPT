import { app, BrowserWindow, Tray, Menu, nativeImage } from 'electron';
import path from 'path';

let tray: Tray | null = null;
let mainWindow: BrowserWindow | null = null;

app.whenReady().then(() => {
  // Create tray
  const icon = nativeImage.createEmpty();
  tray = new Tray(icon);
  tray.setToolTip('BuildFlow Pro AI Companion');
  
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open', click: () => mainWindow?.show() },
    { label: 'Quit', click: () => app.quit() },
  ]);
  tray.setContextMenu(contextMenu);

  // Create window
  mainWindow = new BrowserWindow({
    width: 400,
    height: 300,
    show: false,
    webPreferences: { preload: path.join(__dirname, 'preload.js') },
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  
  console.log('🚀 BuildFlow Companion started');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
