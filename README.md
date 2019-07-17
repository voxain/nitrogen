# Nitrogen
A beatuiful web browser written in javascript.

Under active development.

## How to install
------
There are currently no builds available to download.

So instead, follow this step-by-step guide:
* Clone or download the repository.
* `npm i` ⚠ WARNING: The `npm i` command will also install the package 'ewc'. To build it, you will have to install the packages 'windows-build-tools' (`npm i -g windows-build-tools --vs2015` inside an administrator powershell)  and 'node-gyp'. The 'ewc' module is responsible for the background blur which currently only works on windows. I will add it as an optional dependency in the future to provide support for mac and linux.
* `npm start`
* Enjoy!

## Screenshots
------
Main window
![Screenshot](Screenshots/mainwindow.png)

### Different blur types
Acrylic
![Screenshot](Screenshots/blurAcrylic.png)

BlurBehind
![Screenshot](Screenshots/blurBehind.png)

Transparent
![Screenshot](Screenshots/blurTransparent.png)

Solid
![Screenshot](Screenshots/blurSolid.png)