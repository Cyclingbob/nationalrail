// ©Cyclingbob 2021. All rights reserved. This material must not be copied and redistributed under any conditions, with or without commerical gain. Exceptions only apply where exclusive permission has been granted.
// 1st to 2nd October 2021
// This code generates a token to access the National Rail Open Data API (https://opendata.nationalrail.co.uk/) and then uses this to download and uncompress a zip file. Once uncompressed, the files are stored in /basic_output.

const fetch = require('node-fetch')
const unzip = require('unzipper')
const config = require('../config')
const bufferToStream = require('../assets/bufferToStream')

fetch(`https://opendata.nationalrail.co.uk/authenticate?username=${config.email}&password=${config.password}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}).then(data => data.json()).then(data => {
    fetch('https://opendata.nationalrail.co.uk/api/staticfeeds/2.0/fares', {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Auth-Token': data.token
        }
    }).then(response => response.buffer()).then(async response => {
        bufferToStream(response).pipe(unzip.Extract({ path: __dirname + '/basic_output' }))
    })

})
