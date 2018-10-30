# ZipMan
#### *This repository is only for website development of ZipMan. The actual source code of ZipMan is [here](https://bitbucket.org/vasanthdeveloper/zipman).*

### How To Build
_Clone the master branch of the repository._
```
git clone --single-branch --branch "master" https://github.com/vasanthdeveloper/ZipMan.git "Website"
```

_Enter the newly clonned repository._
```
cd ./Website
```

_Install all the NodeJS packages which are required for building._
```
npm install
```

_Start by freshly building the website, visit_ <a target="_blank" href="http://localhost:4037">_here_</a> _for preview and do the required modifications._
```
npm run start
```

_Once done, run the below command to clean the build directory._
```
npm run clean
```

_Prepare for publishable build directory by cloning the website's static branch._
```
npm run clone
```

_Run the build once again, but this time the build directory will not be cleaned and GulpJS won't watch for any changes. Also the developement server won't listen and the result will be minified and optimized._
```
npm run build
```

_Once completed, finally push to the public repository._
```
npm run push
```

_Finally, push the source code to the master branch._
```
git add --all; git commit; git push
```
#### How It Started
I saw a YouTube video, in which a file with extension ".zip", was extracted by double clicking on it (in macOS High Sierra). After searching for a week, on how to extract a ZIP file by double clicking on it in Windows, I created this software. With it, to extract a ZIP file, just double click it and it should be extracted in a folder with same name as the ZIP file.