import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: "Noto Sans TC", sans-serif;
  font-weight: 350;
  font-size: 1rem;
  text-decoration: none;
  list-style: none;
}
//Adjust for chrome default scrollbar css
::-webkit-scrollbar {
  width: 6px;
  background-color: #F5F5F5;
  margin-left: 20px;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  background-color: #555;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  border-radius: 10px;
  background-color: #F5F5F5;
}

#root {
  overflow: hidden;
}
`;

export default GlobalStyle;
