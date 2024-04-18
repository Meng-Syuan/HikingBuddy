import React from 'react';
import ReactDOM from 'react-dom/client';
import 'mapbox-gl/dist/mapbox-gl.css';
import './index.css';
import GlobalStyle from './assets/GlobalStyle';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App.jsx';
import Home from './pages/Home/Home.jsx';
import Profile from './pages/Profile/Profile.jsx';
import PathPlanner from './pages/PathPlanner';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <>
    <GlobalStyle />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="/path-planner" element={<PathPlanner />}></Route>
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </>

  // </React.StrictMode>
);
