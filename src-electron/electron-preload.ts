/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 *
 * WARNING!
 * If accessing Node functionality (like importing @electron/remote) then in your
 * electron-main.ts you will need to set the following when you instantiate BrowserWindow:
 *
 * mainWindow = new BrowserWindow({
 *   // ...
 *   webPreferences: {
 *     // ...
 *     sandbox: false // <-- to be able to import @electron/remote in preload script
 *   }
 * }
 */

import { ipcRenderer, contextBridge } from 'electron';

/* const algorithm = 'aes-256-cbc'; */
function getPassword(secret: string) {
  let encrypted = ipcRenderer.sendSync('read-password');
  let passphrase = '';
  if (!encrypted) {
    const passphrase = ipcRenderer.sendSync('generate-password');
    encrypted = ipcRenderer.sendSync('encrypt', secret, passphrase);
    ipcRenderer.sendSync('save-password', encrypted);
  } else {
    passphrase = ipcRenderer.sendSync('decrypt', secret, encrypted);
  }
  return passphrase;
}

declare global {
  interface Window {
    getPassword: typeof getPassword;
  }
}
contextBridge.exposeInMainWorld('getPassword', getPassword);
