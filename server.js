const express = require('express');
const bodyParser = require('body-parser');
const models = require("./models");
const PORT = '3000';

const app = express();

app.use(express.static(__dirname + '/src')); // 정적 파일 서비스**
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//URL을 통해 전달되는 데이터에 한글,공백 등과 같은 문자가 포함될 경우 제대로 인식되지 않는 문제 해결

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/src/html/home.html");
    const userInput = req.body;
    console.log(userInput);
})

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + "/src/html/signup.html");
})

app.post('/signup', (req, res) =>{
    console.log(req.body.id);
    res.sendStatus(200);
    models.User.create({
        user_name: req.body.username,
        user_id: req.body.id,
        user_password: req.body.password,
    })
})

app.get('/login', (req, res) => {
    res.sendFile(__dirname + "/src/html/login.html");
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });
  


app.listen(PORT, () => console.log('3000 port connected'));