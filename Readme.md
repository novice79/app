# Epub file reader app

## Features: 

1. Embedded http server(with reactjs spa ui), so natively enable upload/download ebooks via wifi

    For reference: [App backend performance](app-backend-performance.md)

2. Embedded custom fonts that can be switch between
3. Enable family/friends read packs books on your phone or raspberry pi at the same time, with different progress?

## Limitation:

Can only read epub format, thanks to epubjs 

## Known issue:

Restore last reading location may drift, i.e. not return to exact same page when last left off

There are open issues:

https://stackoverflow.com/questions/58796059/epub-js-rendition-display-does-not-work  
https://github.com/futurepress/epub.js/issues/895  

