// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron')
const path = require('path');
const Today = require('./Today');
const Theme = require('./Theme');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    minWidth:300,
    minHeight:400,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    
  })

  // mainWindow.resizable = false;

  // and load the index.html of the app.
  mainWindow.loadFile('pages/index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.on("close", e => {
      mainWindow = null;
      app.quit();
  });
  
  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null
  });
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();

  const today = new Today();

  ipcMain.on('addTodo', (err,todo) => {
    today.addTodo(todo);
  });

  ipcMain.on('deleteTodo', (err,todo) => {
    today.deleteTodo(todo);
  });

  ipcMain.on('addDone', (err,todo) => {
    today.addDone(todo);
  });

  ipcMain.on('setTheme', (err,theme) => {
    Theme.setTheme(theme)
  });

  mainWindow.webContents.once("dom-ready", async () => {
    try {
      const theme = await Theme.getTheme();
      if(typeof theme == 'object'){
        //Theme does not saved
        Theme.setTheme('light');
        mainWindow.webContents.send("initTheme", 'light');
      }else{
        mainWindow.webContents.send("initTheme", theme);
      }
    } catch (error) {
      mainWindow.webContents.send("initTheme", 'light');
    }

    mainWindow.webContents.send("initialize", today);
  });

  // mainWindow.on('focus', (event) => {
  //     globalShortcut.registerAll(['CommandOrControl+R','Shift+Command+R','F5'], () => {})
  // })

  // mainWindow.on('blur', (event) => {
  //     globalShortcut.unregisterAll()
  // })

});

const menuTemplate = [
  {
    label: "Today",
    submenu: [
      {
        label: "About",
        click: () => {
          dialog.showMessageBox(mainWindow, {
            type: "info",
            title: "About",
            message: "Today",
            detail:"Today is basic todo app built by @metehankurucu.",
            icon: path.join(__dirname, "assets/png/64x64.png")
          });
        }
      },
      {
        label: "Quit",
        accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
        role: "quit"
      }
    ]
  }
];

const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);



// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
});



// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
