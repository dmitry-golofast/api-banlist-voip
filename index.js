const fs = require('fs');
const express = require('express');
const app = express();
const axios = require("axios");
const csv = require('csv-parser');

app.use(express.json())

app.get('/', (req, res) => {
    res.json({message: 'Welcome to app'})
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

const results = [];
fs.createReadStream('./files/parse1.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            console.log('Arrow from file is ready')
        })

setTimeout(() => {
    results.forEach(() => {
        const options = {
            method: 'GET',
            url: 'https://spamcheck.p.rapidapi.com/index.php',
            params: { number: '79209520373' },
            headers: {
                'X-RapidAPI-Key': '0245290e33msh7645fe8afd5977ap1f43fdjsn986734f432ca',
                'X-RapidAPI-Host': 'spamcheck.p.rapidapi.com'
            }
        };

        axios.request(options).then(function (response) {
            console.log(response.data)
            const logStream = fs.createWriteStream('./my.json', response.data, {flags: 'a'});
            logStream.write('Initial line...');
            // fs.appendFile(
            //         './my.json',
            //         ,
            //         function (err) {
            //             if (err) {
            //                 console.error('my.json is not ready');
            //             }
            //             console.log('Saved!');
            //         }
            //     );
            logStream.end('this is the end line');


            // fs.appendFile(
            //     './my.json',
            //     JSON.stringify(response.data),
            //     function (err) {
            //         if (err) {
            //             console.error('my.json is not ready');
            //         }
            //         console.log('Saved!');
            //     }
            // );
        }).catch(function (error) {
            console.error(error);
        })
    })

}, 1000);