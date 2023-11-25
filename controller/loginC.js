const path = require('path');
const models = require("../models");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const renderLogin = (req, res) => {
    return res.sendFile(path.join(__dirname,"../src/html/login.html"));
};

const loginApi = (req, res) => {
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
            // req.session.user = result;
            // req.session.stdid = req.body.id;
            try {
                const accessToken = jwt.sign({
                    id: foundData.stdid,
                    name: foundData.name,
                }, process.env.ACCESS_TOKEN, {
                    expiresIn : '1m',
                    issuer : "About Tech",
                });
                const refreshToken = jwt.sign({
                    id: foundData.stdid,
                    name: foundData.name,
                }, process.env.REFRESH_TOKEN, {
                    expiresIn : '24h',
                    issuer : "About Tech",
                });
                res.cookie("refreshToken", refreshToken, {
                    secure : false,
                    httpOnly : true,
                });
    
                res.cookie("accessToken", accessToken, {
                    secure : false,
                    httpOnly : true,
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
        return res.status(404).send('해당하는 ID를 찾을 수 없습니다.');
      }
    })
};

const logoutAPi = (res, req) => {
    // 세션을 삭제하거나 만료시킴
  req.session.destroy(err => {
    if (err) {
      console.error('세션 삭제 실패:', err);
      return res.status(500).send('세션 삭제 실패');
    }
    res.status(200).send('로그아웃 되었습니다.');
  });
}

module.exports = {
    renderLogin,
    loginApi,
    logoutAPi,
}