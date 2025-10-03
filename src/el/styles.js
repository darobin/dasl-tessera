
import { css } from 'lit';

// export const header2 = css`
//   h2 {
//     font-family: var(--header-fam);
//     font-size: 1rem;
//     font-weight: 900;
//     text-decoration: underline;
//     text-decoration-color: var(--electric-bright);
//     text-decoration-thickness: 2px;
//     margin: 0;
//   }
// `;

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
