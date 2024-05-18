import React from 'react';
import ReactDOM from 'react-dom/client';
import GlobalStyle from './assets/GlobalStyle';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import App from './App.jsx';
import Home from './pages/Home/Home.jsx';
import Profile from './pages/Profile';
import ProfileHome from './pages/Profile/ProfileHome.jsx';
import ScheduleDetails from './pages/Profile/ScheduleDetails';
import PathPlanner from './pages/PathPlanner';
import Protector from './pages/Protector';
import PostLists from './pages/PostsList';
import Post from './pages/PostsList/PostContent';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="/path-planner" element={<PathPlanner />}></Route>
      <Route path="/profile" element={<Profile />}>
        <Route index element={<ProfileHome />} />
        <Route
          path="/profile/schedule-details/:scheduleId"
          element={<ScheduleDetails />}
        />
      </Route>
      <Route path="/postslist" element={<PostLists />} />
      <Route path="/post/:postId" element={<Post />} />
      <Route path="/protector/:encryptedScheduleId" element={<Protector />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <>
      <GlobalStyle />
      <RouterProvider router={router} />
    </>
  </React.StrictMode>
);
