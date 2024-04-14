import { css } from "styled-components";

const hoverMixin = (hover, unhover) => css`
  .${hover} {
    display: none;
  }
  &:hover {
    cursor: pointer;
    .${hover} {
      display: inline-block;
    }

    .${unhover} {
      display: none;
    }
  }
`;
export default hoverMixin;
