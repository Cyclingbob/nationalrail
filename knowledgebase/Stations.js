// ©Cyclingbob 2021. All rights reserved. This material must not be copied and redistributed under any conditions, with or without commerical gain. Exceptions only apply where exclusive permission has been granted.
// 2nd October 2021
// This code generates a token to access the National Rail Open Data API (https://opendata.nationalrail.co.uk/) and then uses this to get all the stations. I've written the code so only the first station is logged to the console, but all are available. The result is a JavaScript Object.

const fetch = require('node-fetch')
const parseString = require('xml2js').parseString
const config = require('../config')

fetch(`https://opendata.nationalrail.co.uk/authenticate?username=${config.email}&password=${config.password}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}).then(data => data.json()).then(data => {
    fetch('https://opendata.nationalrail.co.uk/api/staticfeeds/4.0/stations', {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Auth-Token': data.token
        }
    }).then(data => data.text()).then(data => {
        parseString(data, function(err, result){
            console.log(result.StationList.Station[0]) // I recommend you don't log all of them, there is 2589 stations at the time of writing!
        })
    })
})
