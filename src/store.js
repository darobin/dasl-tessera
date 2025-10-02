
import { getCurrentWindow, currentMonitor, LogicalSize, PhysicalPosition } from "@tauri-apps/api/window";

// ## Window management
// Note that we don't manage all the state ourselves, we just wrap it as it it
// were stores and actions, so that we may manage it later if needed.
export async function positionMainWindow () {
  const win = getCurrentWindow();
  const mon = await currentMonitor();
  await win.setSize(new LogicalSize(600, mon.workArea.size.height));
  await win.setPosition(new PhysicalPosition(0, 0));
}
