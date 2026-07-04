const { app, BrowserWindow } = require('electron');
const path = require('path');
const { fork } = require('child_process');

let apiProcess = null;

function startApiServer() {
  const serverPath = path.join(__dirname, '../server/index.mjs');
  
  // We force API_PORT to 3333 for consistency in the app
  apiProcess = fork(serverPath, [], {
    env: {
      ...process.env,
      API_PORT: '3333',
      OLLAMA_HOST: process.env.OLLAMA_HOST || 'http://127.0.0.1:11434',
      OLLAMA_MODEL: 'qwen2.5:3b'
    },
    silent: false
  });

  apiProcess.on('error', (err) => {
    console.error('Erro no processo da API:', err);
  });

  apiProcess.on('exit', (code) => {
    console.log(`Processo da API encerrou com código ${code}`);
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 950,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    title: "Lero Lero de Valfenda",
    backgroundColor: '#0c0a09',
  });

  // Remove default menu bar
  win.setMenu(null);

  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    win.loadURL('http://localhost:5173');
    // Open DevTools in dev mode
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  startApiServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  if (apiProcess) {
    apiProcess.kill();
  }
});
