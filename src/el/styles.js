
import { css } from 'lit';

export const buttons = css`
  sl-button::part(base) {
    border: none;
    /*background-color: var(--electric-dark);*/
    /*border-color: var(--electric-dark);*/
    color: var(--emerald);
    transition: all var(--sl-transition-medium);
  }
  sl-button::part(base):hover {
    background-color: var(--fresh-green);
    color: var(--hot-yellow);
  }
`;

export const errors = css`
  .error {
    color: var(--sl-color-danger-500);
  }
`;
