const express = require('express');
const bodyParser = require('body-parser');
const models = require("./models");
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
const expressSession = require('express-session');
const cors = require('cors');
const PORT = '5000';

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
app.use(cors());
app.use(express.static(__dirname + '/src')); // 정적 파일 서비스**
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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

app.get('/homepage', (req, res) => { //home url
  return res.sendFile(__dirname + "/src/html/ex.html");
});


app.get('/', (req, res) => {
  const userInput = req.body;
  console.log(userInput);
  return res.sendFile(__dirname + "/src/html/home.html");
});



app.get('/signup', (req, res) => { //회원가입 페이지
  if (req.session.user) {
    return res.redirect("/login");
  }
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

app.post('/memSignup', (req, res) => { //admin페이지 전용

  models.codecureMem.findAll()
    .then((records) => {
      if (records.length > 0) {
        return res.status(200).send('이미 명단이 있습니다!');
      } else {
        const receivedData = req.body;
        const saltRounds = 10;
        for (let i = 0; i < receivedData.length; i++) {
          const currentArray = receivedData[i];
          if (currentArray.role == "임원") {
            currentArray.is_admin = true;
          }
          else
            currentArray.is_admin = false;
          const password = String(currentArray.stdid);
          bcrypt.hash(password, saltRounds, function (err, hashed_password) {
            if (err) throw err;
            models.codecureMem.create({
              major: currentArray.major,
              stdid: currentArray.stdid,
              grade: currentArray.grade,
              name: currentArray.name,
              role: currentArray.role,
              password: hashed_password,
              is_admin: currentArray.is_admin
            })

          })

        }
        return res.status(200).send('명단이 생성되었습니다.');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });



});

app.get('/memSignup/deleteAll', (req, res) => { //admin 페이지 전용
  models.codecureMem.findOne({
    where: {
      stdid: req.session.stdid
    }
  })
    .then(foundData => {
      if (foundData) {
        if (foundData.is_admin == 1) {
          models.codecureMem.destroy({
            where: {},
            truncate: true
          })
          return res.status(200).send('명단이 모두 초기화되었습니다.');
        }
      } else {
        return res.status(200).send('명단을 삭제할 권한이 없습니다.');
      }

    })
});

app.get('/modMem', (req, res) => { //admin 회원정보
  if (req.session.user) {
    return res.sendFile(__dirname + "/src/html/modifyMem.html");
  }
});

// app.post('/modifyMem', (req, res) => {
//   const newPassword = req.body;
//   bcrypt.hash(newPassword.password, saltRounds, function(err, hashed_password){
//             if(err) throw err;
//             models.User.create({
//                 user_name: req.body.username,
//                 user_id: req.body.id,
//                 user_password: hashed_password,
//             })
//         })
  
//   if (updatedRows > 0) {
//     res.status(200).send("Success");
//   } else {
//     return res.status(404).send("Not found"); // 업데이트된 행이 없을 경우 처리할 내용
//   }
// } catch (error) {
//   console.error(error);
//   return res.status(500).send("Internal Server Error"); // 에러 발생 시 처리할 내용
// }
// })


app.get('/logout', (req, res) => { //로그아웃api
  // 세션을 삭제하거나 만료시킴
  req.session.destroy(err => {
    if (err) {
      console.error('세션 삭제 실패:', err);
      return res.status(500).send('세션 삭제 실패');
    }
    res.status(200).send('로그아웃 되었습니다.');
  });
});

app.get('/login', (req, res) => { //admin 로그인
  return res.sendFile(__dirname + "/src/html/login.html");
});

app.post('/login', (req, res) => { //login api
  console.log(req.body);
  const response_password = req.body.password;
  models.codecureMem.findOne({
    where: {
      stdid: req.body.id
    }
  })
    .then(foundData => {
      if (foundData) {
        bcrypt.compare(response_password, foundData.password, function (err, result) {
          if (err) throw err;
          if (result) {
            console.log('login 성공');
            req.session.user = result;
            req.session.stdid = req.body.id;
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
});

app.get("/boardList", (req, res) => { //admin 페이지
  return res.sendFile(__dirname + "/src/html/boardList.html");
});

app.get('/boardList/api', async (req, res) => { //bordList api(모든 게시글)
  try {
    // 데이터베이스에서 게시글 정보 조회
    const posts = await models.Board.findAll();

    // 클라이언트로 HTML 파일과 게시글 정보를 전달
    res.json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get("/boardWrite", (req, res) => { //admin 게시글 작성
  if (req.session.user) {
    return res.sendFile(__dirname + "/src/html/boardWrite.html");
  }
});

app.get("/boardList/:id", (req, res) => { //
  return res.sendFile(__dirname + "/src/html/boardDetail.html");
});

app.get("/boardList/:id/api", (req, res) => { //boardList에서 Detail로 가는 api
  const id = req.params.id;
  models.Board.findOne({
    where: {
      id: id
    }
  })
    .then(foundData => {
      if (foundData) {
        foundData.count += 1;
        models.Board.update({ count: foundData.count }, // 업데이트할 값
          { where: { id: id } })
        return res.json(foundData);
      } else {
        return res.status(404).send("데이터를 찾을 수 없습니다.");
      }
    })
});

app.post("/boardWrite", (req, res) => { //게시글 작성 api
  if (req.session.user) {
    models.Board.create({
      title: req.body.title,
      content: req.body.content,
      count: 0,
      User: req.session.userid
    })
  }

});

app.get("/delete/:id", (req, res) => { //게시글 삭제 api
  const id = req.params.id;
  models.Board.destroy({
    where: {
      id: id
    }
  })
    .then(deletedRows => {
      if (deletedRows > 0) {
        return res.status(200).send("success");
      }
      else {
        return res.status(200).send("fail");
      }
    })
});

app.get("/boardUpdate/:id", (req, res) => {
  return res.sendFile(__dirname + "/src/html/boardUpdate.html");
})

app.get("/loadDatabase/:id", async (req, res) => {
  const id = req.params.id;
  await models.Board.findOne({
    where: {
      id: id
    }
  })
    .then(foundData => {
      if (foundData) {
        return res.json(foundData);
      }
      else {
        return res.status(404).send("데이터를 찾을 수 없습니다.");
      }
    });
});

app.post("/boardUpdate/api/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;

    // 비동기적으로 데이터베이스 업데이트를 수행
    const updatedRows = await models.Board.update(updateData, {
      where: {
        id: id
      }
    });

    if (updatedRows > 0) {
      res.status(200).send("Success");
    } else {
      return res.status(404).send("Not found"); // 업데이트된 행이 없을 경우 처리할 내용
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error"); // 에러 발생 시 처리할 내용
  }
});

app.post("/comment/:id", async (req, res) => {
  console.log(req.body);
  if (req.session.user) {
    try {
      await models.Comment.create({
        comment_user_id: req.session.userid,
        comment_content: req.body.comment,
        comment_board_id: req.params.id,
        parent_comment_id: null,
      });
      return res.status(200).send("comment success");
    } catch (error) {
      console.error("Error creating comment:", error);
      return res.status(500).send("internal server error");
    }
  } else {
    return res.status(200).send("please login");
  }
});

app.get(`/commentList/:id`, (req, res) => {
  models.Comment.findAll({
    where: {
      comment_board_id: req.params.id
    }
  })
    .then(foundData => {
      console.log(foundData);
      if (foundData) {
        return res.json(foundData);
      }
      else {
        return res.json({ message: "댓글이 없습니다" });
      }
    })
})



app.listen(PORT, () => console.log(`${PORT}port connected`));