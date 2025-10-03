
import { getCurrentWindow, currentMonitor, LogicalSize, PhysicalPosition } from "@tauri-apps/api/window";
// import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { open as openDialog } from '@tauri-apps/plugin-dialog';
import CarTileReader from "./car-reader.js";


// ## Window management
//
// Note that we don't manage all the state ourselves, we just wrap it as it it
// were stores and actions, so that we may manage it later if needed.
export async function positionMainWindow () {
  const win = getCurrentWindow();
  const mon = await currentMonitor();
  await win.setSize(new LogicalSize(600, mon.workArea.size.height));
  await win.setPosition(new PhysicalPosition(0, 0));
}

// ## Tiles
//
export async function openTile () {
  const tile = await openDialog({
    title: 'Open Tile',
    multiple: false,
    filters: [{
      name: 'Tile',
      extensions: ['tile'],
    }],
  });
  if (!tile) return;
  const ctr = new CarTileReader(tile);
  await ctr.open();
  // XXX
  // - parse tile
  // - add to list of previously open
  // - load into a window
}


// trying things
// document.querySelector('#win').onclick = () => {
//   console.warn(`open window`);
//   const webview = new WebviewWindow('bafkreifn5yxi7nkftsn46b6x26grda57ict7md2xuvfbsgkiahe2e7vnq4', {
//     url: '/cid.html',
//     // x: 0,
//     // y: 0,
//     width: 800,
//     height: 600,
//   });
//   webview.once('tauri://created', function () {
//    // webview successfully created
//   });
//   webview.once('tauri://error', function (e) {
//    // an error happened creating the webview
//   });
//   // const appWindow = new Window('win/bafkreifn5yxi7nkftsn46b6x26grda57ict7md2xuvfbsgkiahe2e7vnq4');
//   // console.warn(`win`, appWindow);
//   // appWindow.once('tauri://created', async () => {
//   //   console.warn(`win created`);
//   //   const wv = new Webview(appWindow, 'wv/bafkreifn5yxi7nkftsn46b6x26grda57ict7md2xuvfbsgkiahe2e7vnq4', {
//   //     url: '/index.html',
//   //     // url: 'https://berjon.com/',
//       // x: 0,
//       // y: 0,
//       // width: 800,
//       // height: 600,
//   //   });
//   //   console.warn(`wv`, wv);
//   //   console.warn(`show`, await wv.show());
//   //   wv.once('tauri://created', () => {
//   //     console.warn(`wv created`);
//   //   });
//   //   console.warn(`waiting for wv`);
//   // });
// };
