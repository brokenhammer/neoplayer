// 在主进程中.
const { app, BrowserWindow } = require('electron')
const ipc = require('electron').ipcMain
const request = require('request')
const fs = require('fs')

// 或者从渲染进程中使用 `remote`.
// const { BrowserWindow } = require('electron').remote
let win
var ratio
var newSize = [932, 490]

function downloadView (src, dest, callback) {
    request({"url":src, "rejectUnauthorized": false}).pipe(fs.createWriteStream(dest)).on('close', function () {
        callback(dest)
    })
}
function createWindow() {
    win = new BrowserWindow({ width: newSize[0], height: newSize[1], frame: false })
    win.setMenuBarVisibility(false)
    // 加载远程URL
    downloadView("http://phynatic.tk/tmp/electron-view.html", "video-tmp.html", function(dest){
        win.loadFile(dest)
    })
    // win.loadFile('video.html')
    win.on('closed', () => {
        win = null
    })

    win.on('will-resize', (e, newBounds) => {
        if(newBounds.width != win.getSize()[0]){
            newBounds.height = Math.trunc(newBounds.width * ratio)
        }else{
            newBounds.width = Math.trunc(newBounds.height*1.0 / ratio)
        }
        newSize = [newBounds.width, newBounds.height]
    })
    win.on('resize', (e) => {
        win.setSize(newSize[0], newSize[1]+1)
    })
}

app.on('ready', createWindow)

ipc.on('initSize', (sys, width, height) => {

    width = parseInt(width)
    height = parseInt(height)
    ratio = height * 1.0 / width
    var crt_width = win.getSize()[0]
    var new_height = Math.trunc(crt_width * ratio)+1;
    newSize = [crt_width, new_height]
    win.setSize(newSize[0], newSize[1])
})

ipc.on('close', (sys) => {
    console.log('close')
    win.close()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})

