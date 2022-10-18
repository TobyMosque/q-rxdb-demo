import { app, BrowserWindow, nativeTheme, ipcMain } from 'electron';
import path from 'path';
import os from 'os';
import { createHash, createCipheriv, createDecipheriv } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import { generate } from 'generate-passphrase';

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(
      path.join(app.getPath('userData'), 'DevTools Extensions')
    );
  }
} catch (_) {}

let mainWindow: BrowserWindow | undefined;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  });

  mainWindow.loadURL(process.env.APP_URL);

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow?.webContents.closeDevTools();
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = undefined;
  });

  function generateKeys(secret: string) {
    return {
      key: createHash('sha256').update(secret).digest(),
      iv: createHash('md5').update(secret).digest(),
    };
  }
  ipcMain.on('generate-key-iv', function (evt, secret) {
    evt.returnValue = generateKeys(secret);
  });
  ipcMain.on('read-password', function (evt) {
    try {
      evt.returnValue = readFileSync('credentials', 'utf-8');
    } catch {
      evt.returnValue = '';
    }
  });
  ipcMain.on('save-password', function (evt, text) {
    writeFileSync('credentials', text, { encoding: 'utf-8' });
    evt.returnValue = true;
  });
  ipcMain.on('generate-password', function (evt) {
    evt.returnValue = generate({ length: 16, separator: '_', numbers: false });
  });

  const algorithm = 'aes-256-cbc';
  ipcMain.on('encrypt', function (evt, secret, password) {
    const { key, iv } = generateKeys(secret);
    const cipher = createCipheriv(algorithm, Buffer.from(key), iv);
    const encrypted = Buffer.concat([cipher.update(password), cipher.final()]);
    evt.returnValue = encrypted.toString('base64');
  });

  ipcMain.on('decrypt', function (evt, secret, encrypted) {
    const { key, iv } = generateKeys(secret);
    const binary = Buffer.from(encrypted, 'base64');
    const decipher = createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    const decrypted = Buffer.concat([
      decipher.update(binary),
      decipher.final(),
    ]);
    evt.returnValue = decrypted.toString();
  });

  /*
  function encrypt(text) {
   let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
   let encrypted = cipher.update(text);
   encrypted = Buffer.concat([encrypted, cipher.final()]);
   return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}
  */
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === undefined) {
    createWindow();
  }
});
