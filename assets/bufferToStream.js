// ©Cyclingbob 2021. All rights reserved. This material must not be copied and redistributed under any conditions, with or without commerical gain. Exceptions only apply where exclusive permission has been granted.
// 2nd October 2021
// This code turns a response buffer into a stream. This can then be piped to a file or another function.

const Readable = require('stream').Readable; 

module.exports = function(buffer){
    var stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    return stream;
}
