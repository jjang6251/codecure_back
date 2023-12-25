const path = require('path');
const models = require("../models");

const memSignupApi = (req, res) => {
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
};

const memSignupDeleteAllApi = (req, res) => {
    if (req.id) {
        models.codecureMem.findOne({
          where: {
            stdid: req.id
          }
        })
          .then(foundData => {
            if (foundData) {
              if (foundData.is_admin == 1) {
                models.codecureMem.destroy({
                  where: {},
                  truncate: true
                })
                  .then(() => {
                    return res.status(200).send('명단이 모두 초기화되었습니다.');
                  })
                  .catch(error => {
                    console.error('Error deleting records:', error);
                    return res.status(500).send('서버 오류로 명단 삭제에 실패했습니다.');
                  });
              } else {
                return res.status(200).send('명단을 삭제할 권한이 없습니다.');
              }
            } else {
              return res.status(200).send('로그인한 사용자를 찾을 수 없습니다.');
            }
          })
          .catch(error => {
            console.error('Error finding user:', error);
            return res.status(500).send('서버 오류로 사용자 검색에 실패했습니다.');
          });
      } else {
        return res.status(200).send('로그인이 필요한 기능입니다!');
      }
}

module.exports = {
    memSignupApi,
    memSignupDeleteAllApi,
}