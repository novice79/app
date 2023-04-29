
function interceptClickEvent(rendition, e) {
    // this is a's child element
    // console.log(e.target);
    // this is a element
    // console.log(e.currentTarget);
    const aEle = e.currentTarget;
    const href = aEle.getAttribute('href');
    // console.log(`href=${href}`)
    if (href.indexOf('#') > -1)
    {
        e.preventDefault();
        e.stopPropagation()
        rendition.display(href)
    }
}

export default function linkInterceptor(content, rendition){
    content.addStylesheet("/css/font.css")
    const aEle = content.document.getElementsByTagName('a')
    const items = Array.prototype.slice.call(aEle);
    items.forEach( item=>{
        // console.log(item)
        item.addEventListener('click', interceptClickEvent.bind(null, rendition), false);
    }); 
}