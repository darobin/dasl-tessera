
import { LitElement, html, css } from "lit";
import { openTile, openWindow } from '../store.js';
import { buttons } from "./styles.js";

customElements.define("ts-app", class extends LitElement {
  static styles = [
    css`
      :host {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
      }
      main {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
      }
      #content {
        flex-grow: 1;
      }
      #actions {
        padding: 0.5rem 1rem;
        text-align: right;
      }
      sl-button {
        font-size: 1.4rem;
        color: var(--darker-deep-sky-blue);
      }
    `,
    buttons,
  ];
  render () {
    return html`
      <main>
        <div id="content"></div>
        <div id="actions">
          <sl-button @click=${openWindow}>
            <sl-icon name="file-earmark-plus" slot="prefix"></sl-icon>
            Open Window Debug
          </sl-button>
          <sl-button @click=${openTile}>
            <sl-icon name="file-earmark-plus" slot="prefix"></sl-icon>
            Open Tile
          </sl-button>
        </div>
      </main>
    `;
  }
});
