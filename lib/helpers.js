'use strict';

const fs = require('fs-extra'),
    os = require('os'),
    path = require('path'),
    uid = require('uid-safe'),
    pkg = require('../package.json');

class Helpers {
	constructor() { }

    /**
     * Checks if n is numeric
     * @param  {String}  n
     * @return {Boolean}
     */
    static isNumeric(n){
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    /**
     * Checks if file/folder exists.
     * @param  {String} filePath
     * @return {Boolean}
     */
    static exists(filePath){
    	try {
    		let stats = fs.statSync(filePath);
    		return stats.isFile() || stats.isDirectory();
    	}catch(err){
    		return false;
    	}
    }

    /**
     * var is a function
     * @param  {Function}  functionToCheck
     * @return {Boolean}
     */
    static isFunction(varToCheck) {
        var getType = {};
        return varToCheck && getType.toString.call(varToCheck) === '[object Function]';
    }

    /**
     * Creates a temporary folder for extraction
     * @param  {Boolean} temp if supplied create a temporary folder
     * @param  {String} root (optional)
     * @return {String}
     */
    static extractFolder(temp, root) {

        temp = temp ? true : false;

        let newPath = '';

        // Extract path
        if ( root && this.exists(root) ){
            newPath = path.join( root, (temp ? uid.sync(10) : '') );
        }else{
            newPath = path.join( os.tmpdir(), pkg.name, (temp ? uid.sync(10) : '') );
        }

        fs.ensureDirSync(newPath);

        return newPath;

    }

}

module.exports = Helpers;