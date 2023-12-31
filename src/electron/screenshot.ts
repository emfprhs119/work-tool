import { BrowserWindow, screen, app, desktopCapturer } from 'electron';
import { writeFileSync } from 'fs';
import path from 'path';

function openScreenCropWindow(
  windowCoords: { x: number; y: number; width: number; height: number },
  screenArr: { fileFullPath: string; coords: Electron.Rectangle }[]
) {
  const { x, y, width, height } = windowCoords;
  const window = new BrowserWindow({
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

  const tagImgs = screenArr.map(
    ({ fileFullPath, coords }) =>
      `<img id="screenshot" style="position:fixed;left:${coords.x - x};top:${
        coords.y - y
      };" onload="showWindow()" onFail="closeWindow()" src=${fileFullPath} alt="screenshot" width=${
        coords.width
      } height=${coords.height}>`
  );
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
  const canvas = `<canvas id='canvas' width=${width} height=${height}></canvas>;`;
  const script = `
  function closeWindow(){window.myAPI.async('close')};
  function showWindow(){setTimeout(()=>window.myAPI.async('show'),200)};
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var rect = {startX:0,endX:0,startY:0,endY:0,x:0,y:0,width:0,height:0};
  var drag = false;
  var imageObj = null;
  var canvasWidth = ${width};
  var canvasHeight = ${height};

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
    if ((rect.w > 2 || rect.w < -2) && (rect.h > 2 || rect.h < -2)){
      const cropArea = {x:rect.startX, y:rect.startY, width:rect.w>0?rect.w:-rect.w, height:rect.h>0?rect.h:-rect.h}
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
    `data:text/html;charset=utf-8,<head>${style}</head><body>${tagImgs.join(
      ''
    )}${canvas}<script>${script}</script></body>`
  );
}

export const screenshot = async () => {
  const displays = screen.getAllDisplays();
  const captureData = [];
  for (const display of displays) {
    const captures = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: display.size,
    });
    for (const capture of captures) {
      if (capture.display_id === display.id.toString()) {
        const tmpPath = path.join(app.getPath('temp'), `${capture.display_id}.png`);
        writeFileSync(tmpPath, capture.thumbnail.toPNG());
        captureData.push({ coords: display.bounds, fileFullPath: tmpPath });
      }
    }
  }
  const { x, y, width, height } = captureData[0].coords;
  const width1 = captureData[1].coords.width;
  openScreenCropWindow({ x, y, width: width + width1, height }, captureData);
};
