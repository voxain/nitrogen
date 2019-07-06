const fs            = require('fs');
const request       = require('request');
const progress      = require('request-progress');
const EventEmitter  = require('events').EventEmitter;

class Download extends EventEmitter{
    constructor(item){
        super();
        this.item = item;
        this.id = Date.now() * Math.round( Math.random() * 100 );
        this.name = item.getFilename();
        this.size = 0;
        console.log('Download started: ' + item.getFilename());
        this.dl = progress( request(item.getURL()) )
        .on('progress', state => {
            this.emit('progress', state);
        })
        .on('end', state => {
            this.emit('finish', state);
        })
        .pipe( fs.createWriteStream( item.getFilename() ) );
    }
}

module.exports = Download;