const { exec } = require('child_process');

let pythonProcess; // 存儲 Python 子進程的引用

// 定義函數以啟動 Python 腳本
function startPythonScript() {
    // 執行 Python 腳本並將輸出流連接到父進程
    pythonProcess = exec('python pymqttsql.py', (error, stdout, stderr) => {
        if (error) {
          console.error(`執行錯誤: ${error}`);
          return;
        }
        //console.log(`Python 腳本輸出: ${stdout}`);
    });
    
    // 監聽 Python 子進程的 stdout 和 stderr 事件
    pythonProcess.stdout.on('data', (data) => {
        console.log(`Python 輸出: ${data}`);
    });
    
    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python 錯誤: ${data}`);
    });
}

// 定義函數以重新啟動 Python 腳本
function restartPythonScript() {
    if (pythonProcess) {
        pythonProcess.kill(); // 停止當前的 Python 子進程
    }
    startPythonScript(); // 重新啟動 Python 腳本
}

// 在伺服器啟動時啟動 Python 腳本
startPythonScript();

// 導出重新啟動 Python 腳本的函數，以便在需要時重新啟動它
module.exports = restartPythonScript;
