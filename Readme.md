# Epub file reader app

## Features: 

1. Embedded http server(with reactjs spa ui), so natively enable upload/download ebooks via wifi

    For reference: [App backend performance](app-backend-performance.md)

2. Embedded custom fonts that can be switched between
3. Enable family/friends read packs of books on your phone or raspberry pi at the same time, with different progress?

## Limitation:

Can only read epub format, thanks to epubjs 

## Known issue:

Restore last reading location may drift, i.e. not return to exact the same page when last left off

There are open issues:

- https://stackoverflow.com/questions/58796059/epub-js-rendition-display-does-not-work  
- https://github.com/futurepress/epub.js/issues/895  



# Typical Usages

1. Open app on raspberry pi or mobile device
2. Use laptop/desktop browser upload packs of books to the device via wifi
3. Start reading or sharing books  
*in the case of mobile sharing, leave it run on foreground, even better, plug in charger*
4. Optionally, download books from ebook app on other devices within intranet

<div style="display:flex;flex-wrap: wrap;align-items: center;justify-content: center;">
     <div style="margin:3rem;"> 
        <h3><i>Open app on android, started out with empty shelf</i></h3>
        <img style="max-width:400px;max-height:400px;" src="screenshots/1_android-ebook-app-begin.jpg"/>
    </div>
     <div style="margin:3rem;"> 
        <h3><i>Upload books from macbook(or any other node in the same intranet)</i></h3>
        <img style="max-width:400px;max-height:400px;" src="screenshots/2_macbook-upload-books-to-android.jpg" />
    </div>
     <div style="margin:3rem;"> 
        <h3><i>Books show in app book shelf</i></h3>
        <img style="max-width:400px;max-height:400px;" src="screenshots/3_books-show-in-app.jpg" />
    </div>
     <div style="margin:3rem;"> 
        <h3><i>Show app address qrcode</i></h3>
        <img style="max-width:400px;max-height:400px;" src="screenshots/show-app-address-qrcode.jpg" />
    </div>
     <div style="margin:3rem;"> 
        <h3><i>Iphone scan this qrcode, and open the spa app in safari</i></h3>
        <img style="max-width:400px;max-height:400px;" src="screenshots/open-android-spa-on-iphone-safari.jpg" />
    </div>
     <div style="margin:3rem;"> 
        <h3><i>Show book content</i></h3>
        <img style="max-width:400px;max-height:400px;" src="screenshots/show-book-content.jpg" />
    </div>
     <div style="margin:3rem;"> 
        <h3><i>Show book settings</i></h3>
        <img style="max-width:400px;max-height:400px;" src="screenshots/show-book-settings.jpg" />
    </div>
     <div style="margin:3rem;"> 
        <h3><i>Read chinese book with lishu(隶书) font, which embedded in app</i></h3>
        <img style="max-width:400px;max-height:400px;" src="screenshots/read-chinese-book-with-lishu-font.jpg" />
    </div>
     <div style="margin:3rem;"> 
        <h3><i>Download(or delete) epub file on another ipad</i></h3>
        <img style="max-width:400px;max-height:400px;" src="screenshots/download-epub-file-from-ipad.jpg" />
    </div>
</div>