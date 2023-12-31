import { execFile } from 'child_process';
import path from 'path';
import { EventEmitter } from 'stream';

class ClipboardEventListener extends EventEmitter {
  child: any;
  constructor() {
    super();
    this.child = null;
  }

  startListening() {
    const { platform } = process;
    if (platform === 'win32') {
      this.child = execFile(path.join(__dirname, 'clipboard-event-handler-win32.exe'));
    } else {
      throw 'Not supported';
    }

    this.child.stdout.on('data', (data: string) => {
      if (data.trim() === 'CLIPBOARD_CHANGE') {
        this.emit('change');
      }
    });
  }

  stopListening() {
    const res = this.child.kill();
    return res;
  }
}

export default new ClipboardEventListener();
