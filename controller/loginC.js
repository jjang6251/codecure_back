const path = require('path');
const models = require("../models");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function isValidUsername(username) {
  const regex = /\s|select|SELECT|\*|'/g;
  return !regex.test(username);
}

const renderLogin = (req, res) => {
  return res.sendFile(path.join(__dirname, "../src/html/login.html"));
};

const loginApi = (req, res) => {
  const response_password = req.body.password;

  if (isValidUsername(req.body.id)) {
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
              // req.session.user = result;
              // req.session.stdid = req.body.id;
              try {
                const accessToken = jwt.sign({
                  id: foundData.stdid,
                  name: foundData.name,
                }, process.env.ACCESS_TOKEN, {
                  expiresIn: '1h',
                  issuer: "About Tech",
                });
                // const refreshToken = jwt.sign({
                //     id: foundData.stdid,
                //     name: foundData.name,
                // }, process.env.REFRESH_TOKEN, {
                //     expiresIn : '24h',
                //     issuer : "About Tech",
                // });
                // res.cookie("refreshToken", refreshToken, {
                //     secure : false,
                //     httpOnly : true,
                // });

                res.cookie("accessToken", accessToken, {
                  secure: false,
                  httpOnly: true,
                });
              } catch (error) {
                res.status(200).send(error);
              }


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
          return res.status(200).send('해당하는 ID를 찾을 수 없습니다.');
        }
      })
  } else {
    return res.status(201).send('sql injection 금지.(여기도 해놨지롱~)');
  }

};

const logoutAPi = (req, res) => {

  res.clearCookie('accessToken', { path: '/', expires: new Date(0) });
  return res.status(200).send('로그아웃 되었습니다.');
}

module.exports = {
  renderLogin,
  loginApi,
  logoutAPi,
}