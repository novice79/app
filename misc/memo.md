gh repo create app --public -d "Cross platform SPA apps"
git remote add origin n79:novice79/app

npm create vite@latest spa -- --template react
cd spa
npm i lodash jotai uuid buffer -S
npm i @mui/lab @mui/material @emotion/react @emotion/styled @mui/icons-material @fontsource/roboto -S
npm i epubjs react-router-dom localforage -S
<!-- on second thought, not need this -->
npm uninstall localforage -S
lldb --file ./dist/darwin20/bin/ebook