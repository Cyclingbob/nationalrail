// ©Cyclingbob 2021. All rights reserved. This material must not be copied and redistributed under any conditions, with or without commerical gain. Exceptions only apply where exclusive permission has been granted.
// 2nd October 2021
// This code generates a token to access the National Rail Open Data API (https://opendata.nationalrail.co.uk/) and then uses this to get the current public promotions happening right now. The output is a JavaScript object. I have written it so the first public promotion in the list is logged into the console.

const fetch = require('node-fetch')
const parseString = require('xml2js').parseString
const config = require('../config')

fetch(`https://opendata.nationalrail.co.uk/authenticate?username=${config.email}&password=${config.password}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}).then(data => data.json()).then(data => {
    fetch('https://opendata.nationalrail.co.uk/api/staticfeeds/4.0/promotions-publics', {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Auth-Token': data.token
        }
    }).then(data => data.text()).then(data => {
        parseString(data, function(err, result){
            console.log(result.PromotionList.Promotion[0]) // I recommend you don't log all of them, there was 548 public promotions when I looked!
        })
    })
})
