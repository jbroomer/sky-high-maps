var request=require('request');
const express = require('express');
const os = require('os');

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(express.static('dist'));
app.get('/api/getUsername', (req, res) => console.log("hi"));

app.post('/api/elevation', (req, res) => {
    const latitude = req.body.latitude.toString() 
    const longitude = req.body.longitude.toString() 
    request(`https://api.jawg.io/elevations?locations=${latitude},${longitude}&access-token=nxDpCqbZqBDd2Wjwjfn1fXnsvsIKN5bR21BqmaERNmISlT8znELvMtx4aXnoFb86`, function (error, response, body) {
         res.send({response: response.body})
    });

  })
app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));