var electron = require('electron');
var path = require('path');
var windowStateKeeper = require('electron-window-state');

var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var Menu = electron.Menu;
var MenuItem = electron.MenuItem;

var mainWindow = null;

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function () {

  var mainWindowState = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 600
  });

  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, 'expose.js')
    }
  });

  mainWindowState.manage(mainWindow);

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  var template = [
    {
      label: "File",
      submenu: [
        {
          label: "Developer Tools",
          click: function (a, b) {
            mainWindow.webContents.openDevTools();
          }
        }
      ]
    }
  ];

  var menu = Menu.buildFromTemplate(template);

  mainWindow.setMenu(menu);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

});