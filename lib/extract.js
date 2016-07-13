'use strict';

const cli = require('simple-cli-parser'),
	path = require('path'),
	_ = require('lodash'),
    fs = require('fs-extra'),
	Helpers = require('./helpers'),
	Out = require('./out');

class Zip {

	/**
     * 7z wrapper for extract and list
     * @param  {Object} options { input: '/archive.zip', output: '/tmp', createFolder: true }
     */
    constructor(opts) {
    	this.options = opts || {};
    }

    /**
     * List the files in the archive
     * @return {Promise}
     */
    list() {

    	return new Promise((resolve, reject) => {

    		if ( !this.options.input || ( this.options.input && !Helpers.exists(this.options.input) ) ){
    			reject(new Error('archive path not supplied'));
    		}else{

    			new cli([ '7z', 'l', this.options.input ])
    				.then( data => {
    					resolve( Out.list(data) );
    				})
    				.catch(reject);
    		}

    	});

    }

    /**
     * Extract all/single file from archive
     * @param  {Function} process (optional)
     * @param  {String} file (optional)
     * @return {Promise}
     */
    extract(process, file) {
        if ( process && !Helpers.isFunction(process) ){ file = process; }

    	return new Promise((resolve, reject) => {

    		if ( !this.options.input || ( this.options.input && !Helpers.exists(this.options.input) ) ){
    			reject(new Error('archive path not supplied'));
    		}else{

    			// Check for output path
    			this.options.newOutput = Helpers.extractFolder(this.options.createFolder, this.options.output);

    			let parts = [ '7z', 'e', this.options.input, '-aoa', '-o' + this.options.newOutput ];

    			// Individual file, optional
    			if (file && file.length && file.length > 0){ parts.push(file); }


                this.list()
                    .then( data => data.files )
                    .then( files => { return _.filter(files, file => { return file.name.indexOf('__MACOSX') === -1; }) } )
                    .then( files => {

                        // If archive actually has valid files
                        if (files.length > 0){

                            process({
                                count: files.length,
                                index: 0,
                                percent: 0
                            });

                            // Start the extraction
                            new cli(parts)
                                .then( data => {
                                    resolve(data);
                                });

                            // Monitor extraction folder for changes, to track progress
                            let processedFiles = [];
                            fs.watch(this.options.newOutput, (event, filename) => {

                                let file = _.find(files, { name: filename });

                                if ( filename && file ){
                                    if ( processedFiles.indexOf(filename) === -1 ){

                                        let sizeOnDisk = fs.statSync(path.join( this.options.newOutput, filename )).size;

                                        // If file on disk is the same size as the one in the archive we know extraction is complete
                                        if (file.size == sizeOnDisk){
                                            processedFiles.push(filename);

                                            process({
                                                count: files.length,
                                                index: processedFiles.length,
                                                percent: (processedFiles.length / files.length) * 100
                                            });
                                        }

                                    }
                                }
                            });

                        }else{
                            fs.removeSync(this.options.newOutput);
                            reject(new Error('invalid archive'));
                        }

                    });

    		}

    	});

    }

}

module.exports = Zip;