
import { getCurrentWindow, currentMonitor, LogicalSize, PhysicalPosition } from "@tauri-apps/api/window";
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
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

// XXX this might not be real
export async function openWindow () {
  console.warn(`open window`);
  new WebviewWindow('bafkreifn5yxi7nkftsn46b6x26grda57ict7md2xuvfbsgkiahe2e7vnq4', {
    url: '/cid.html?cid=bafkreifn5yxi7nkftsn46b6x26grda57ict7md2xuvfbsgkiahe2e7vnq4',
    x: 1000,
    y: 0,
    width: 800,
    height: 600,
    incognito: true,
  });
  new WebviewWindow('xxxx', {
    url: '/cid.html?cid=xxxx',
    x: 2000,
    y: 7000,
    width: 800,
    height: 600,
    incognito: true,
  });
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
