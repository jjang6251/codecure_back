const express = require('express');
const bodyParser = require('body-parser');
const models = require("./models");
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();
const cookieParser = require("cookie-parser");
const expressSession = require('express-session');
const cors = require('cors');

const { renderLogin, loginApi, logoutAPi} = require('./controller/loginC');
const {memSignupApi, memSignupDeleteAllApi} = require('./controller/signupC');
const {boardListApi, boardWriteApi, boardListToDetailApi, boardDeleteApi, boardUpdateApi, loadBoardApi, createCommentApi, commentListApi} = require('./controller/boardC');

const PORT = '5000';

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname + '/src')); // 정적 파일 서비스**
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//URL을 통해 전달되는 데이터에 한글,공백 등과 같은 문자가 포함될 경우 제대로 인식되지 않는 문제 해결
app.use(cookieParser());

function verifyToken(req, res, next) {
  // Authorization 헤더에서 토큰 추출
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: '토큰이 제공되지 않았습니다.' });
  }

  // 토큰 검증
  jwt.verify(token.split(' ')[1], 'secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: '토큰이 유효하지 않습니다.' });
    }

    // 요청에서 추출된 정보 활용 (예: 유저 아이디)
    req.userId = decoded.userId;
    next();
  });
}

// 보호된 엔드포인트 설정
app.get('/protected', verifyToken, (req, res) => {
  // 토큰 검증을 통과한 경우에만 실행되는 코드
  res.json({ message: '인증되었습니다!', userId: req.userId });
});

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


app.get('/', (req, res) => {
  // if(req.session.user){
  //   models.Sites.
  // }
  return res.sendFile(__dirname + "/src/html/home.html");
});




app.get('/signup', (req, res) => { //회원가입 페이지
  return res.sendFile(__dirname + "/src/html/signup.html");
});

// app.post('/signup', (req, res) =>{ //signup api
//     const saltRounds = 10;
//     const password = req.body.password;
//     bcrypt.hash(password, saltRounds, function(err, hashed_password){
//         if(err) throw err;
//         models.User.create({
//             user_name: req.body.username,
//             user_id: req.body.id,
//             user_password: hashed_password,
//         })
//     })

//     console.log(req.body.id);
//     return res.sendStatus(200);
// });

app.post('/memSignup', memSignupApi);



app.get('/memSignup/deleteAll', memSignupDeleteAllApi);

app.get('/modMem', (req, res) => { //admin 회원정보
  if (req.session.user) {
    return res.sendFile(__dirname + "/src/html/modifyMem.html");
  }
});

app.post('/modifyMem', (req, res) => {
  const newPassword = req.body.password; // req.body.password로 수정하여 실제 비밀번호 값을 가져옵니다.
  bcrypt.hash(newPassword, saltRounds, function (err, hashed_password) {
    if (err) {
      return res.status(500).send("Error hashing password");
    }
    models.User.update({ password: hashed_password }, {
      where: {
        stdid: req.session.stdid
      }
    })
    .then((updateRows) => {
      if (updateRows[0] > 0) {
        res.status(200).send("Success");
      } else {
        res.status(404).send("Not found"); // 업데이트된 행이 없을 경우 처리할 내용
      }
    })
    .catch((error) => {
      console.error("Error updating user:", error);
      res.status(500).send("Internal Server Error");
    });
  });
});

app.get('/memberList', (req, res) => {
  return res.sendFile(__dirname + "/src/html/memList.html");
});

app.get('/memList', (req, res) => {
  models.codecureMem.findAll()
  .then(users => {
    return res.json(users);
  })
  .catch(error => {
    console.error('Error fetching users:', error);
  });
})


app.get('/logout', logoutAPi);

app.get('/login', renderLogin);

app.post('/login', loginApi);

app.get("/boardList", (req, res) => { //admin 페이지
  return res.sendFile(__dirname + "/src/html/boardList.html");
});

app.get('/boardList/api', boardListApi);

app.get("/boardWrite", (req, res) => { //admin 게시글 작성
  if (req.session.user) {
    return res.sendFile(__dirname + "/src/html/boardWrite.html");
  }
});

app.get("/boardList/:id", (req, res) => { //
  return res.sendFile(__dirname + "/src/html/boardDetail.html");
});

app.get("/boardList/:id/api", boardListToDetailApi);

app.post("/boardWrite", boardWriteApi);

app.get("/delete/:id", boardDeleteApi);

app.get("/boardUpdate/:id", (req, res) => {
  return res.sendFile(__dirname + "/src/html/boardUpdate.html");
})

app.get("/loadDatabase/:id", loadBoardApi);

app.post("/boardUpdate/api/:id", boardUpdateApi);

app.post("/comment/:id", createCommentApi);

app.get(`/commentList/:id`, commentListApi);



app.listen(PORT, () => console.log(`${PORT}port connected`));