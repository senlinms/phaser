var Class = require('../../utils/Class');
var CONST = require('../const');
var File = require('../File');
var FileTypesManager = require('../FileTypesManager');
var GetFastValue = require('../../utils/object/GetFastValue');
var ParseXML = require('../../dom/ParseXML');

//  Phaser.Loader.FileTypes.XMLFile

var XMLFile = new Class({

    Extends: File,

    initialize:

    function XMLFile (key, url, path, xhrSettings)
    {
        var fileKey = (typeof key === 'string') ? key : GetFastValue(key, 'key', '');

        var fileConfig = {
            type: 'xml',
            extension: GetFastValue(key, 'extension', 'xml'),
            responseType: 'text',
            key: fileKey,
            url: GetFastValue(key, 'file', url),
            path: path,
            xhrSettings: GetFastValue(key, 'xhr', xhrSettings)
        };

        File.call(this, fileConfig);
    },

    onProcess: function (callback)
    {
        this.state = CONST.FILE_PROCESSING;

        this.data = ParseXML(this.xhrLoader.responseText);

        if (this.data === null)
        {
            throw new Error('XMLFile: Invalid XML');
        }

        this.onComplete();

        callback(this);
    }

});

//  When registering a factory function 'this' refers to the Loader context.
//  
//  There are several properties available to use:
//  
//  this.scene - a reference to the Scene that owns the GameObjectFactory

FileTypesManager.register('xml', function (key, url, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            this.addFile(new XMLFile(key[i], url, this.path, xhrSettings));
        }
    }
    else
    {
        this.addFile(new XMLFile(key, url, this.path, xhrSettings));
    }

    //  For method chaining
    return this;
});

module.exports = XMLFile;
