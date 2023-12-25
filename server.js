const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const models = require("./models");
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();
const cookieParser = require("cookie-parser");
const expressSession = require('express-session');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const { renderLogin, loginApi, logoutAPi} = require('./controller/loginC');
const {memSignupApi, memSignupDeleteAllApi} = require('./controller/signupC');
const {boardListApi, boardWriteApi, boardListToDetailApi, boardDeleteApi, boardUpdateApi, loadBoardApi, createCommentApi, commentListApi, boardListBoard, boardListQna, boardListNotice} = require('./controller/boardC');

const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cors({
  origin: `${process.env.CORS}`,
  credentials: true
}));
app.use(express.static(__dirname + '/src')); // 정적 파일 서비스**
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//URL을 통해 전달되는 데이터에 한글,공백 등과 같은 문자가 포함될 경우 제대로 인식되지 않는 문제 해결
app.use(cookieParser());

function verifyToken(req, res, next) {
  // 쿠키에서 토큰 추출
  const token = req.cookies['accessToken']; // 'token_name'에는 실제 토큰이 저장된 쿠키 이름을 입력하세요

  console.log(token);

  if (!token) {
    return res.status(403).json('토큰이 없습니다!!');
  }

  console.log(process.env.ACCESS_TOKEN);

  const secretKey = process.env.ACCESS_TOKEN;

  // 토큰 검증
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      res.clearCookie('accessToken', { path: '/', expires: new Date(0) });
      return res.status(401).json({ message: 'TokenFail' });
    }

    // 요청에서 추출된 정보 활용 (예: 유저 아이디)
    req.cookie_id = decoded.id;
    req.cookie_name = decoded.name;
    next();
  });
}

// 보호된 엔드포인트 설정
app.get('/protected', verifyToken, (req, res) => {
  // 토큰 검증을 통과한 경우에만 실행되는 코드
  res.json({ message: '인증되었습니다!', userId: req.cookie_id });
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


app.get('/checkLogin',verifyToken, (req, res) => {
  const {accessToken} = req.cookies;

  if(accessToken) {
    return res.status(200).json({isLoggedIn: "true", username: req.cookie_name});
  } else {
    return res.status(200).json({isLoggedIn: "false"});
  }
});

app.get('/', (req, res) => {
  // if(req.session.user){
  //   models.Sites.
  // }
  return res.sendFile(__dirname + "/src/html/home.html");
});





app.post('/memSignup', memSignupApi);



app.get('/memSignup/deleteAll',verifyToken, memSignupDeleteAllApi);

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


app.get('/logout',verifyToken, logoutAPi);

app.get('/login', renderLogin);

app.post('/login', loginApi);

app.get("/boardList", (req, res) => { //admin 페이지
  return res.sendFile(__dirname + "/src/html/boardList.html");
});

app.get('/boardList/api', boardListApi);

app.get("/boardBoardList", boardListBoard);

app.get("/boardNoticeList", boardListNotice);

app.get("/boardQnaList", boardListQna);

app.get("/boardWrite", verifyToken, (req, res) => { //admin 게시글 작성
  if (req.cookie_id) {
    return res.sendFile(__dirname + "/src/html/boardWrite.html");
  }
});

app.get("/boardList/:id", (req, res) => { //
  return res.sendFile(__dirname + "/src/html/boardDetail.html");
});


app.get("/boardList/:id/api", boardListToDetailApi);

app.post("/boardWrite", verifyToken ,boardWriteApi);

app.get("/delete/:id",verifyToken, boardDeleteApi);

app.get("/boardUpdate/:id", (req, res) => {
  return res.sendFile(__dirname + "/src/html/boardUpdate.html");
})

app.get("/loadDatabase/:id", loadBoardApi);

app.post("/boardUpdate/api/:id", boardUpdateApi);

app.post("/comment/:id",verifyToken, createCommentApi);

app.get(`/commentList/:id`,verifyToken, commentListApi);



app.listen(PORT, () => console.log(`${PORT}port connected`));