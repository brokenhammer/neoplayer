var electronInstaller = require('electron-winstaller');
var path = require("path");

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: path.join('./build/neoplayer-win32-x64'), //刚才生成打包文件的路径
    outputDirectory: path.join('./build/neoplayer-installer64'), //输出路径
    authors: 'xsw', // 作者名称
    exe: 'neoplayer.exe', //在appDirectory寻找exe的名字
    msi: true, //不需要mis
    description: "An awesome video player"
  });

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));