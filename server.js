const express = require('express');
const bodyParser = require('body-parser');
const PORT = '3000';

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
    const userInput = req.body;
    console.log(userInput);
})

app.listen(PORT, () => console.log('3000 port connected'));