// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, globalShortcut, session  } = require('electron')
const path = require('path');
const Today = require('./Today');
const Theme = require('./Theme');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    
  })

  mainWindow.resizable = false;

  // and load the index.html of the app.
  mainWindow.loadFile('pages/index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

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
        console.log('Burda değil');
      }else{
       console.log('Burda');
        mainWindow.webContents.send("initTheme", theme);
      }
    } catch (error) {
      console.log(error);
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

function initTheme(){
  storage.get(date, function(error, data) {
    if (error){
        reject(error);
    } 
    console.log(data);
    resolve(data);
});
}


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
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
