const fs = require('fs');
const express = require('express');
const app = express();
const axios = require("axios");
const csv = require('csv-parser');

app.use(express.json());

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});

const results = [];
fs.createReadStream('./files/parse.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            console.log('Arrow has been finished')
        });

setTimeout(() => {
    results.forEach(phone => {
        axios({
            method: 'GET',
            url: 'https://spamcheck.p.rapidapi.com/index.php',
            params: phone,
            headers: {
                'X-RapidAPI-Key': '0245290e33msh7645fe8afd5977ap1f43fdjsn986734f432ca',
                'X-RapidAPI-Host': 'spamcheck.p.rapidapi.com'
            }
        })
            .then(function (response) {
                console.log(response.data);
                const json = JSON.stringify(response.data);
                if (response.data.response === 'Spam') {
                    fs.appendFile('phoneSpamList.xml', `\r\n${json}`, (err) => {
                        if (err) throw err;
                        console.log('Data has been added!');
                    });
                } else {
                    fs.appendFile('phoneNoSpamList.xml', `\r\n${json}`, (err) => {
                        if (err) throw err;
                        console.log('Data has been added!');
                    });
                }
            })
    })
}, 1000);