import { useState, useEffect } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai'
import { fileAtom, noteAtom } from './atom'
import './App.css'
import Home from './Home'
import Viewer from './Viewer'
import Editor from './Editor'
import ErrorPage from "./error-page";
import WS from "./ws";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/view",
    element: <Viewer />,
  },
  {
    path: "/edit",
    element: <Editor />,
  },
]);
function App() {
  const [lng, setLng] = useState(navigator.language);
  const [, setNote] = useAtom(noteAtom)
  const [, setFile] = useAtom(fileAtom)
  const { t } = useTranslation();
  useEffect(() => {
    window.onlanguagechange = (event) => {
      const l = navigator.language.split('-')[0]
      setLng(l)
      // console.log(`l=${l}`)
    }
    return () => window.onlanguagechange = null
  }, []);
  useEffect(() => {
    document.title = t('html-title')
    // console.log(`document.title=${document.title}`)
  }, [lng]);
  
  useEffect(() => {
    const file_ws = new WS('/store', msg=>{
      const data = JSON.parse(msg)
      // console.log('ws data=', data)
      setFile(data)
    })
    const note_ws = new WS('/note', msg=>{
      const data = JSON.parse(msg)
      // console.log('ws data=', data)
      setNote(data)
    })
    return ()=>{file_ws.close();note_ws.close();}
  }, []);
  return (
    <RouterProvider router={router} />
  )
}

export default App
