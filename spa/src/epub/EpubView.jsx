import { useState, useEffect, useRef, memo, forwardRef, useImperativeHandle } from 'react'
// import $ from 'jquery';
import { Book} from 'epubjs';

function EpubView(props, ref) {
  const {
    url, loadingView, tocChanged,
    location, locationChanged
  } = props
  const [isLoaded, setIsLoaded] = useState(false)
  const [toc, setToc] = useState([])
  const bookRef = useRef(), renditionRef = useRef(), locationRef = useRef()
  const viewerRef = useRef( null )

  function initBook(){
    bookRef.current && bookRef.current.destroy()
    bookRef.current = new Book(url)
    bookRef.current.loaded.navigation.then(({ toc }) => {
      setIsLoaded(true)
      setToc(toc)
    })
  }
  useEffect(() => {
    initBook()
    document.addEventListener('keyup', KeyUp, false)
    return ()=>{
      bookRef.current && bookRef.current.destroy()
      document.removeEventListener('keyup', KeyUp, false)
    }
  }, []);
  useEffect(() => {
    initReader()
    tocChanged && tocChanged(toc)
  }, [toc]);
  useEffect(() => {
    if(locationRef.current != location){
      renditionRef.current.display(location).catch(reason=>renditionRef.current.display())
    }
  }, [location]);
  useEffect(() => {
    initBook()
  }, [url]);
  
  function prevPage() {
    renditionRef.current.prev()
  }
  function nextPage() {
    renditionRef.current.next()
  }
  useImperativeHandle(ref, () => ({
    prevPage() {
      prevPage()
    },
    nextPage() {
      nextPage()
    }
  }));
  function initReader() {
    const { getRendition } = props
    const node = viewerRef.current
    renditionRef.current = bookRef.current.renderTo(node, {
      contained: true,
      manager: "continuous",
      flow: "paginated",
      width: "100%",
      height: "100%",
      allowScriptedContent: true,
      snap: true
    })
    registerEvents()
    getRendition && getRendition(renditionRef.current)

    if (typeof location === 'string' || typeof location === 'number') {
      renditionRef.current.display(location).catch(reason=>renditionRef.current.display())
    } else if (toc.length > 0 && toc[0].href) {
      renditionRef.current.display(toc[0].href)
    } else {
      renditionRef.current.display()
    }
  }

  function registerEvents() {
    const { handleKeyPress, handleTextSelected, handleClick } = props
    renditionRef.current.on('locationChanged', onLocationChange)
    renditionRef.current.on('keyup', handleKeyPress || KeyUp)
    renditionRef.current.on('click', handleClick)
    if (handleTextSelected) {
      renditionRef.current.on('selected', handleTextSelected)
    }
  }

  function onLocationChange(loc){
    const newLocation = loc && loc.start
    if (location !== newLocation) {
      locationRef.current = newLocation
      locationChanged && locationChanged(newLocation)
    }
  }

  function KeyUp({ key }) {
    key && key === 'ArrowRight' && nextPage()
    key && key === 'ArrowLeft' && prevPage()
  }

  return (
    <div style={{
      position: 'relative',
      height: '100%',
      width: '100%'
    }}>
      {
        (isLoaded && <div ref={viewerRef} style={{
          height: '100%'
        }} />) 
        || loadingView
      }
    </div>
  )
}
memo(EpubView, (props, nextProps)=> {
  return nextProps.location === props.location
})
/* 
EpubView.defaultProps = {
  loadingView: null,
  locationChanged: null,
  tocChanged: null,
}

EpubView.propTypes = {
  url: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(ArrayBuffer)
  ]),
  loadingView: PropTypes.element,
  location: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  locationChanged: PropTypes.func,
  tocChanged: PropTypes.func,

  getRendition: PropTypes.func,
  handleKeyPress: PropTypes.func,
  handleTextSelected: PropTypes.func
}
*/
export default forwardRef(EpubView)
