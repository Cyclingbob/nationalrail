// ©Cyclingbob 2021. All rights reserved. This material must not be copied and redistributed under any conditions, with or without commerical gain. Exceptions only apply where exclusive permission has been granted.
// 1st to 2nd October 2021
// This code generates a token to access the National Rail Open Data API (https://opendata.nationalrail.co.uk/) and then uses this to download and uncompress a zip file. The 

var details = {
    email: 'YOUR_EMAIL', //your Open Data National Rail account email address
    password: 'YOUR_PASSWORD', //your Open Data National Rail account password
    output_dir: __dirname + 'path/to/your/output/dir //directory to save output files from response.
}

const fetch = require('node-fetch')
const { writeFile } = require('fs').promises;
const unzip = require('unzipper')
const fs = require('fs')

fetch(`https://opendata.nationalrail.co.uk/authenticate?username=${details.email}&password=${details.password}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}).then(data => data.json()).then(data => {
    var token = data.token

    fetch('https://opendata.nationalrail.co.uk/api/staticfeeds/2.0/routeing', {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Auth-Token': token
        }
    }).then(response => response.buffer()).then(async response => {
        await writeFile('data.zip', response)
        fs.createReadStream(__dirname + '/data.zip').pipe(unzip.Extract({ path: details.output_dir }));
    })

})
