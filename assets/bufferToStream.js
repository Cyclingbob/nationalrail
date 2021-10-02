const Readable = require('stream').Readable; 

module.exports = function(buffer){
    var stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    return stream;
}
