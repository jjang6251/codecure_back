const express = require('express');
const bodyParser = require('body-parser');
const models = require("./models");
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
const expressSession = require('express-session');
const PORT = '3000';

const app = express();

const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql',
  charset: 'utf8mb4', // 올바른 문자 인코딩 설정
  collate: 'utf8mb4_unicode_ci',
  // 나머지 연결 설정
});

app.use(express.json());
app.use(express.static(__dirname + '/src')); // 정적 파일 서비스**
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//URL을 통해 전달되는 데이터에 한글,공백 등과 같은 문자가 포함될 경우 제대로 인식되지 않는 문제 해결
app.use(cookieParser());

// 세션세팅
app.use(
  expressSession({
    secret: "my key",
    resave: true,
    saveUninitialized: true,
  })
);

app.use('/boardList', (req, res, next) => {
  // Cache-Control 헤더를 설정하여 캐싱을 비활성화합니다.
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  // 다음 미들웨어로 전달합니다.
  next();
}); //특정 주소에 대해 항상 리프레쉬 진행;

app.get('/homepage', (req, res) => {
  return res.sendFile(__dirname + "/src/html/ex.html");
})


app.get('/', (req, res) => {
    const userInput = req.body;
    console.log(userInput);
    return res.sendFile(__dirname + "/src/html/home.html");
})



app.get('/signup', (req, res) => {
    if(req.session.user){
      return res.redirect("/login");
    }
    return res.sendFile(__dirname + "/src/html/signup.html");
})

app.post('/signup', (req, res) =>{
    const saltRounds = 10;
    const password = req.body.password;
    bcrypt.hash(password, saltRounds, function(err, hashed_password){
        if(err) throw err;
        models.User.create({
            user_name: req.body.username,
            user_id: req.body.id,
            user_password: hashed_password,
        })
    })

    console.log(req.body.id);
    return res.sendStatus(200);
})

app.get('/login', (req, res) => {
    return res.sendFile(__dirname + "/src/html/login.html");
})

app.post('/login', (req, res) => {
    console.log(req.body);
    const response_password = req.body.password;
    models.User.findOne({
        where: {
          user_id: req.body.id
        }
      })
        .then(foundData => {
          if (foundData) {
            bcrypt.compare(response_password, foundData.user_password, function(err, result){
                if (err) throw err;
                if(result) {
                    console.log('login 성공');
                    req.session.user = result;
                    req.session.userid = req.body.id;
                    return res.status(200).send('success');
                }
                else {
                    console.log('로그인 실패(비밀번호 불일치)');
                    return res.status(200).send('fail');
                }
            })
         }
          else {
            console.log('해당하는 id를 찾을 수 없습니다.');
            return res.status(404).send('해당하는 ID를 찾을 수 없습니다.');
          }
        })
})

app.get("/boardList", (req, res) => {
  return res.sendFile(__dirname + "/src/html/boardList.html");
})

app.get('/boardList/api', async (req, res) => {
  try {
    // 데이터베이스에서 게시글 정보 조회
    const posts = await models.Board.findAll();
    console.log(posts);

    // 클라이언트로 HTML 파일과 게시글 정보를 전달
    res.json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get("/boardWrite", (req, res) => {
  if(req.session.user){
    return res.sendFile(__dirname + "/src/html/boardWrite.html");
  }
});

app.get("/boardList/:id", (req, res) => {
  return res.sendFile(__dirname + "/src/html/boardDetail.html");
})

app.get("/boardList/:id/api", (req, res) => {
  const id = req.params.id;
  console.log(id);
  models.Board.findOne({
    where: {
      id: id
    }
  })
  .then(foundData => {
    if (foundData){
      foundData.count += 1;
      models.Board.update({ count: foundData.count }, // 업데이트할 값
      { where: { id: id } })
      console.log(foundData);
      return res.json(foundData);
    } else {
      return res.status(404).send("데이터를 찾을 수 없습니다.");
    }
  })
})

app.post("/boardWrite", (req, res) => {
  if(req.session.user){
    console.log(req.body);
    models.Board.create({
      title: req.body.title,
      content: req.body.content,
      count: 0,
      User: req.session.userid
    })
  }

})

app.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  models.Board.destroy({
    where: {
      id: id
    }
  })
  .then(deletedRows => {
    if(deletedRows > 0) {
      return res.status(200).send("success");
    }
    else {
      return res.status(200).send("fail");
    }
  })
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    return res.status(500).send('Something went wrong!');
  });

  


app.listen(PORT, () => console.log('3000 port connected'));