7z-extract
==========

[![Build Status](https://travis-ci.org/leemm/7z-extract.svg?branch=master)](https://travis-ci.org/leemm/7z-extract)

Wrapper for 7zip which attempts to provide an extraction status (something the 7z command doesn't really do).

# Prerequisites

The **7z** command is required and needs to be in PATH or the root of your application i.e. where package.json is sitting.

```sh
# OSX
$ brew update && brew doctor && brew install p7zip
# Ubuntu
$ sudo apt-get install p7zip-full
```

# Install
```
npm install 7z-extract --save
```

# API

```javascript
const archive = new Zip(options);
```
* **input** *String* - The input file path
* **output** *String* - The output path (optional, if not supplied uses /tmp)
* **createFolder** *Boolean* - Creates a random folder name to extract to the files to. (default ```false```)

```javascript
archive.list(); //- returns a promise, the result of which is an object including array of files in the archive
archive.extract(progress); //- extracts the archive and returns a promise, progress function optionally returns current status as object (index, totalNumberOfFiles, percentage)
```

# Usage

To see info on a CBZ file.

```javascript
'use strict';

const path = require('path'),
    Zip = require('../index'),
    inputFile = path.join(__dirname, 'archive.zip'),
    outputPath = path.join(__dirname), // optional, if not supplied uses /tmp
    progress = info => {
        console.log(info);
    };

const archive = new Zip({ input: inputFile, output: outputPath, createFolder: true });

  // archive.list()
  //  .then(res => { if (res){ console.log('Success!', res); } })
  //  .catch(err => { console.error(err); });

archive.extract(progress)
    .then(res => { console.log('Success!', res); })
    .catch(err => { console.error(err); });

```