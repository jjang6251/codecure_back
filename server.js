const express = require('express');
const bodyParser = require('body-parser');
const PORT = '3000';

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/home.html");
    const userInput = req.body;
    console.log(userInput);
})

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + "/signup.html");
})

app.get('/login', (req, res) => {
    res.sendFile(__dirname + "/login.html");
})

app.listen(PORT, () => console.log('3000 port connected'));