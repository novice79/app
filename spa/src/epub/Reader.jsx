import { useState, useEffect, useRef } from 'react'

import Box from '@mui/material/Box';

import { ArrowBack } from '@mui/icons-material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import TocIcon from '@mui/icons-material/Toc';
import EpubView from './EpubView'
import FontMenu from './FontMenu'
import themes from './themes'

import './Toc.css'
import TocItem from './TocItem'
import LoadingView from './LoadingView'
import util from '../util'
import linkInterceptor from './hook'



export default function Reader({currentBook, backClicked}) {
  const {url, title, author, publisher} = currentBook;
  const readerRef = useRef(), renditionRef = useRef()
  const cifiRef = useRef()
  const [size, setSize] = useState( parseInt(localStorage.getItem('font-size')) || 100)
  
  const [toc, setToc] = useState([])
  const [isMobile] = useState(util.mobileCheck())
  const [showToc, setShowToc] = useState(false)

  const [showMenu, setShowMenu] = useState(false);
  const [location, setLocation] = useState(null)

  useEffect(() => {
    const cifi = localStorage.getItem(`${title}-${author}`)
    cifiRef.current = cifi
    setLocation(cifi)
  }, []);
  const changeSize = newSize => {
    localStorage.setItem('font-size', newSize)
    setSize(newSize)
  }
  function themeSelected(t){
    renditionRef.current.themes.select(t)
    renditionRef.current.start()
    localStorage.setItem('book-theme', t)
  }
  function fontFamilySelected(ff){
    localStorage.setItem('font-family', ff)
    renditionRef.current.themes.font(ff)
  }
  useEffect(() => {
    if (renditionRef.current) {
      renditionRef.current.themes.fontSize(`${size}%`)
    }
  }, [size])
  const locationChanged = cifi => {
    cifiRef.current = cifi
    localStorage.setItem(`${title}-${author}`, cifi)
    // console.log('setItem ', bc)
  }
  function tocIconClicked(){
      setShowToc(p=>{
        const b = !p
        if(b && cifiRef.current){
          let curLoc = renditionRef.current.currentLocation();
          curLoc = curLoc.start
          // console.log('curLoc=', curLoc)
          const regExp = /\[([^\]]+)\]/g;
          const matches = cifiRef.current.match(regExp);
          // console.log('matches=', matches)
          // const curHref = `${curLoc.href}#${(/\[(.+?)\]/).exec(curLoc.cfi)[1]}`
          const curHref = `${curLoc.href}#${matches.pop().replace(/[\[\]]/g, '')}`
          // console.log('curHref=', curHref)
          const id = util.hash_code(curHref)
          // console.log(`current cifi=${cifiRef.current}; id=${id}`)
          const elems = document.querySelectorAll("button.toc");
          [].forEach.call(elems, function(el) {
              el.classList.remove("active");
          });
          // $('button.toc').removeClass('active')
          // console.log($(`#${id}`)[0])
          // $(`#${id}`).addClass('active').scroll()
          const elem = document.getElementById(`${id}`);
          if(elem){
            elem.classList.add("active")
            // console.log(elem, 'scroll to top')
            elem.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
            // elem.scrollTop = 0
          }
        }
        return b
      })
  }
  function tocItemSelected(tocItem){
    setShowToc(false)
    setLocation(tocItem)
  }
  const next = () => {
    const node = readerRef.current
    node && node.nextPage()
  }
  function clickToFlipPage(e){
    if( util.mobileCheck() ) return;
    const sw = screen.width
    // console.log(`e.clientX = ${e.clientX }`)
    // console.log(`sw=${sw}`)
    // setTitle(`e.clientX = ${e.clientX }; sw=${sw}`)
    if ( e.clientX < sw / 2) {
      // console.log('click left')
      prev()
    } else {
      // console.log('click right')
      next()
    }
    // e.stopPropagation();
    // e.preventDefault();
  }
  const prev = () => {
    const node = readerRef.current
    node && node.prevPage()
  }
  return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', flexDirection: 'column',
        position: 'relative' }}
      >
        <Box sx={{bgcolor: '#222', height: '3rem', display: 'flex', alignItems: 'center'}}>
            <ArrowBack 
              onClick={backClicked}
              sx={{ fontSize: '2rem', ml: 3, color: 'white', cursor: 'pointer' }} 
            />
            <Box sx={{flex: 1, color: 'white', textAlign: 'center'}}>{title}</Box>
            <FontMenu size={size} changeSize={changeSize} themeSelected={themeSelected}
              showMenu={showMenu} fontIconClicked={()=>{
                setShowMenu(p=>!p)
              }} fontFamilySelected={fontFamilySelected}
            />
            
            <TocIcon sx={{ fontSize: '2rem', mr: 3, color: 'white', cursor: 'pointer' }} 
            onClick={tocIconClicked}/>
        </Box>
        <div style={{ flex: 1, width: '100%' }}>
          <EpubView
            handleClick={e=>{
              setShowToc(false)
              setShowMenu(false)
              clickToFlipPage(e)
            }}
            ref={readerRef}
            url={url}
            location={location}
            getRendition={r=>{
              renditionRef.current=r
              Object.entries(themes).forEach(entry => {
                const [key, value] = entry;
                // console.log(key, value);
                r.themes.register(key, value);
              });
              const theme = localStorage.getItem('book-theme')
              renditionRef.current.themes.select(theme)
              renditionRef.current.themes.fontSize(`${size}%`)
              r.hooks.content.register(linkInterceptor)
              const ff = localStorage.getItem('font-family')
              renditionRef.current.themes.font(ff)
            }}
            loadingView={<LoadingView/>}
            tocChanged={setToc}
            locationChanged={locationChanged}
          />
        </div>
        <ArrowBackIosIcon sx={{
          position: 'absolute', top: '50%', transform: 'translateY(-50%)',
          cursor: 'pointer', display: `${isMobile && 'none'}`
        }}
          onClick={prev}
        />
        <ArrowForwardIosIcon sx={{
          position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
          cursor: 'pointer', display: `${isMobile ? 'none' : 'block'}`
        }}
          onClick={next}
        />
        <Box sx={{
            ...{
                position: 'absolute', height: '100%', top: 0, left: 0, 
                backgroundColor: '#f2f2f2', zIndex: 7,
                padding: 1, transition: 'all .5s ease', overflow: 'auto', maxWidth: '60vw'
            }, ...(showToc ? { transform: 'translateX(0)' } : { transform: 'translateX(-100%)' })
        }}>
            {toc.map((item, i) => (
                <TocItem
                    {...item}
                    key={i}
                    setLocation={tocItemSelected}
                />
            ))}
        </Box>
        
      </div>
  )
}