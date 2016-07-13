'use strict';

const _ = require('lodash'),
    Helpers = require('./helpers');

class Out {
    constructor() { }

    /**
     * Takes 7z ls output and parses to object
     * @param  {String} data
     * @return {Object}
     */
    static list(data){

    	let lines = data.toString().split('\n');


    	// Get meta data (header of 7z output)
    	let meta = _.filter(lines, line => {
    		return line.indexOf(' = ') > -1
    	}).map(line => {
    		let retObj = {};
    		retObj[line.split(' = ')[0]] = line.split(' = ')[1];
    		return retObj;
    	});

    	let metaFixed = {};
    	meta.map(obj => {
    		metaFixed[Object.keys(obj)[0]] = obj[Object.keys(obj)[0]];
    	});
    	meta = Object.assign(metaFixed, {});


    	// File listing
    	let fileListing = [],
    		headers = [],
    		foundHeaders = false,
    		foundFooter = false;

    	for (let idx = 0; idx < lines.length; idx ++){
    		let line = lines[idx];

    		if (line.indexOf('----------------') > -1 && !foundHeaders){ // Titles or footer
    			headers = _.filter(lines[idx -1].split(' '), line => { return line.length > 0; });
    			foundHeaders = true;
    		}else if (line.indexOf('----------------') > -1 && foundHeaders && !foundFooter){
    			foundFooter = true;
    		}else if (foundHeaders && !foundFooter){
    			let parts = _.filter(line.split(' '), pt => { return pt.length > 0; }),
    				fileObj = {};

    			for (let pti = 0; pti < parts.length - 1; pti ++){
    				fileObj[headers[pti].toLowerCase()] = Helpers.isNumeric(parts[pti]) ? parseInt(parts[pti], 10) : parts[pti];
    			}

    			fileObj[headers[5].toLowerCase()] = parts.slice(parts.length - 1, parts.length).join(' ');

                // Add any missing properties (sometimes 'compressed' returns empty value)
                headers.map(header => {
                    if (!fileObj[header.toLowerCase()]){ fileObj[header.toLowerCase()] = 0; }
                });

    			fileListing.push(fileObj);
    		}
    	}

    	return { meta: meta, files: fileListing };
    }

}

module.exports = Out;