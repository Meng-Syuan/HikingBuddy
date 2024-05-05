import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: "Noto Sans TC", sans-serif;
  font-weight: 300;
  font-size: 1rem;
  text-decoration: none;
  list-style: none;

  //cancel user agent stylesheet
  /* input:-webkit-autofill {
    -webkit-text-fill-color: $brown-color;
    -webkit-box-shadow: 0 0 0 100vw #fff inset;
  } */
  div:-webkit-scrollbar{
    width:2px;
  }
}

`;

export default GlobalStyle;
