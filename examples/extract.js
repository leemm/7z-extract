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
	// 	.then(res => { if (res){ console.log('Success!', res); } })
	// 	.catch(err => { console.error(err); });

	archive.extract(progress)
		.then(res => { console.log('Success!', res); })
		.catch(err => { console.error(err); });