// ©Cyclingbob 2021. All rights reserved. This material must not be copied and redistributed under any conditions, with or without commerical gain. Exceptions only apply where exclusive permission has been granted.
// 14th October 2021
// This code creates a STOMP client to get Darwin updates in real time.
const stompit = require("stompit");
const zlib = require('zlib');
const config = require('../config')
const parseString = require('xml2js').parseString
const connectOptions = {
    "host": config.darwin.host,
    "port": 61613,
    "connectHeaders": {
        "heart-beat": "15000,15000",// hear-beat of 15 seconds
        "client-id": config.darwin.username, // request a durable subscription - set this to the login name you use to subscribe
        "host": "/",
        "login": config.darwin.username, // your username
        "passcode": config.darwin.password   // your password
    }
};

// Reconnect management for stompit client
const reconnectOptions = {
    "initialReconnectDelay": 10,    // milliseconds delay of the first reconnect
    "maxReconnectDelay": 30000,     // maximum milliseconds delay of any reconnect
    "useExponentialBackOff": true,  // exponential increase in reconnect delay
    "maxReconnects": 30000,            // maximum number of failed reconnects consecutively
    "randomize": false              // randomly choose a server to use when reconnecting
                                    // (there are no other servers at this time)    
};

var i = 0

const connectionManager = new stompit.ConnectFailover([connectOptions], reconnectOptions);

connectionManager.connect(function (error, client, reconnect) {
    if (error) {
        console.log(error)
        console.log("Terminal error, gave up reconnecting");
        return;
    }

    client.on("error", function (error) {
        console.log("Connection lost. Reconnecting...");
        reconnect();
    });

    var headers = {
        "destination": "/topic/darwin.pushport-v16", // subscribe for a destination to which messages are sent
        "activemq.subscriptionName": "a",   // request a durable subscription - set this to an unique string for each feed
        "ack": "client-individual"               // the client will send ACK frames individually for each message processed
    };
    
    client.subscribe(headers, function (error, message) {
        if (error) {
            console.log("Subscription failed:", error.message);
            return;
        }
        i = i + 1
        const unzip = zlib.createGunzip()

        if(i == 1){
            var d = ''
            message.pipe(unzip).on('data', function (data){
                d+=data.toString();
            }).on('end', function (){
                parseString(d, function(err, result){
                    console.log(result)
                })
            })
        }
    });
});
