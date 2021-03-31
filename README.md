<img src="res/icons/logo-large.png" alt="Image Sourcerer" width=1024>

*Image Sourcerer* is a browser extension supported on Chrome and Firefox that is designed to download, sort and track images from supported sites. Once complete, this application will help users download images from content-rich sites, letting them control how it is organized and keeping track of the original creators for future reference.

# Contents
- [Installation](#Installation)
- [Supported Sites](#Supported-Sites)
- [Contact Me](#Contact-Me)

# Installation
### To install on Chome (and other browsers that use the chrome store):
1. Download and extract the [latest release](https://github.com/JakeGuy11/image-sourcerer/releases) OR download the lasted commit:
```bash
git clone https://github.com/JakeGuy11/image-sourcerer.git
# or
git clone git@github.com:JakeGuy11/image-sourcerer.git
```
2. Navigate to `chrome://extensions` in your browser. Other brosers that support chrome extensions will usually redirect you to their specific extension pages.
3. Click "Load Unpacked", navigate to where you saved the repository and select open.
5. Open any supported site. The extension should now be functional.
6. Steps 2 through 5 must be repeated every time the browser is restarted until an official release is uploaded.

### To install on FireFox<sup>1</sup>:
1. Download and extract the [latest release](https://github.com/JakeGuy11/image-sourcerer/releases) for Firefox
2. Navigate to `about:debugging` in your browser. On the panel on the left hand side, click "This Firefox"
3. Click "Load Temporary Add-on..." and navigate to where you saved the repository. Select `manifest.json`
5. Open any supported site. The extension should now be functional.
6. Steps 2 through 5 must be repeated every time the browser is restarted until an official release is uploaded.

<sup>1</sup> Up until v0.0.3, Firefox was the primary taget. However, far more browsers support Chrome-style, so the target browser is now Chrome. That said, Firefox will still be supported. Under the folder `firefox` in this repo is the same code but using the Firefox API instead. This folder *will not be updated* during regular commits, only during releases. It will usually be tested, and if it is not, that will be disclosed in the release notes. 

# Supported Sites
- [Reddit](https://www.reddit.com/)

# Contact Me
If you have any feedback, suggestions, errors or just general comments, please email me at Jake_Guy_11@protonmail.ch, or open an error through GitHub. If you have inquiries about *beta testing specifically*, email me or contact me on Discord at JakeGuy11#1541.
