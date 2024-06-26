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
  scroll-behavior: smooth;
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

.tippy-tooltip-content{
  font-size: 0.875rem;
  letter-spacing: 1.25px;
}

.driver-popover{
  min-width: 180px;
  max-width: 250px;
  .driver-popover-title {
  font:400 1rem "Noto Sans TC", sans-serif ;
}
.driver-popover-description{
  font:300 0.875rem "Noto Sans TC", sans-serif ;
  }
}

.cl-logoBox {
    height: 30px;
}

.cl-formButtonPrimary{
  background-color: #417000d3;
  &:hover{
  background-color: #417000;
  }
}

`;

export default GlobalStyle;
