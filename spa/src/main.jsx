import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App'
import Viewer from './Viewer'
import ErrorPage from "./error-page";
import './index.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import i18n from './i18n'
import { Buffer } from 'buffer';
window.Buffer = Buffer;
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/view",
    element: <Viewer />,
  },
]);
window.addEventListener("languagechange", (event) => {
  console.log("languagechange event detected!", navigator.language);
  const lng = navigator.language.split('-')[0]
  console.log(`change to lng=${lng}`)
  i18n.changeLanguage(lng);
});
window.debugUrl = 'http://192.168.0.23:7779'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
