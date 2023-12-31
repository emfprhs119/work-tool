import { execFile } from 'child_process';
import { BrowserWindow, app } from 'electron';
import path from 'path';

function createScreenCropWindow(fileFullPath: string, coords: { x: number; y: number; width: number; height: number }) {
  const { x, y, width, height } = coords;
  const window = new BrowserWindow({
    skipTaskbar: true,
    frame: false,
    movable: false,
    x,
    y,
    webPreferences: {
      webSecurity: false,
      preload: path.resolve(__dirname, 'preload.js'),
      // devTools: true,
    },
    alwaysOnTop: true,
    closable: true,
    minimizable: false,
    fullscreenable: false,
    maximizable: false,
    resizable: false,
    show: false,
    opacity: 0,
  });
  window.setSize(width, height);
  window.on('show', () => {
    window.setOpacity(1);
  });
  const tagImg = `<img id="screenshot" onload="showWindow()" onFail="closeWindow()" src=${fileFullPath} alt="screenshot" width=${
    width - x
  } height=${height - y}>`;
  // const overlayDiv = `<div class="overlay"></div>`;
  const style = `<style>
    * {
      margin:0;
      padding:0;
      overflow:clip;
    }
    canvas {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
    </style>`;
  const canvas = `<canvas id='canvas' width=${width - x} height=${height - y}></canvas>;`;
  const script = `
  function closeWindow(){window.myAPI.async('close')};
  function showWindow(){setTimeout(()=>window.myAPI.async('show'),200)};
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var rect = {startX:0,endX:0,startY:0,endY:0,x:0,y:0,width:0,height:0};
  var drag = false;
  var imageObj = null;
  var canvasWidth = ${width - x};
  var canvasHeight = ${height - y};

  function init() {
    canvas.addEventListener('mousedown', mouseDown, false);
    canvas.addEventListener('mouseup', mouseUp, false);
    canvas.addEventListener('mousemove', mouseMove, false);
    
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = 'black';
    ctx.globalAlpha = 0.4;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  function mouseDown(e) {
    rect.startX = e.pageX - this.offsetLeft;
    rect.startY = e.pageY - this.offsetTop;
    drag = true;
  }

  function mouseUp() {
    drag = false; 
    if ((rect.w > 5 || rect.w < -5) && (rect.h > 5 || rect.h < -5)){
      const cropL = rect.startX < rect.endX ? rect.startX : rect.endX
      const cropT = rect.startY < rect.endY ? rect.startY : rect.endY
      const cropArea = {x:cropL, y:cropT, width:rect.w>0?rect.w:-rect.w, height:rect.h>0?rect.h:-rect.h}
      window.myAPI.async('cropAndCopyClipboard',{'src':'${fileFullPath.replace(
        /\\/g,
        '/'
      )}','rect':cropArea}).then(()=>{closeWindow()});
    }
  }

  function mouseMove(e) {
    if (drag) {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      rect.endX = (e.pageX - this.offsetLeft)
      rect.endY = (e.pageY - this.offsetTop)
      rect.w = rect.endX - rect.startX;
      rect.h = rect.endY - rect.startY;
      ctx.strokeStyle = 'red';
      ctx.strokeRect(rect.startX, rect.startY, rect.w, rect.h);
      
      // ctx.fillStyle = 'white';
      // ctx.globalAlpha = 0.1;
      ctx.fillStyle = 'black';
      ctx.globalAlpha = 0.4;
      const cropL = rect.startX < rect.endX ? rect.startX : rect.endX
      const cropT = rect.startY < rect.endY ? rect.startY : rect.endY
      const cropR = rect.startX < rect.endX ? rect.endX : rect.startX
      const cropD = rect.startY < rect.endY ? rect.endY : rect.startY
      ctx.fillRect(0, 0, canvasWidth, cropT); // top full
      ctx.fillRect(0, cropT, cropL, cropD-cropT); // left
      ctx.fillRect(0, cropD, canvasWidth, canvasHeight-cropD); // bottom full
      ctx.fillRect(cropR, cropT, canvasWidth-cropR, cropD-cropT); // right
    }
  }
  init();
  `;

  window.loadURL(
    `data:text/html;charset=utf-8,<head>${style}</head><body>${tagImg}${canvas}<script>${script}</script></body>`
  );
}

export function screenshot() {
  const fileFullPath = path.join(app.getPath('temp'), 'screenshot.png');
  execFile(path.join(__dirname, 'boxcutter.exe'), ['-f', fileFullPath], function (err, data) {
    if (!err && data) {
      try {
        const coordArr = data.match(/\([\-\d,]*\)/g);
        console.log(data);
        if (coordArr && coordArr.length == 2) {
          const ltRaw = coordArr[0].split(',');
          const x = parseInt(ltRaw[0].replace('(', ''));
          const y = parseInt(ltRaw[1].replace(')', ''));
          const rbRaw = coordArr[1].split(',');
          const width = parseInt(rbRaw[0].replace('(', ''));
          const height = parseInt(rbRaw[1].replace(')', ''));

          createScreenCropWindow(fileFullPath, { x, y, width, height });
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    console.log('fail screenshot');
  });
}
