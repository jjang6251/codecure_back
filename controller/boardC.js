const path = require('path');
const models = require("../models");


const boardListApi = async (req, res) => {
  try {
    // 데이터베이스에서 게시글 정보 조회
    const posts = await models.Board.findAll();

    // 클라이언트로 HTML 파일과 게시글 정보를 전달
    res.json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const boardListBoard = async (req, res) => {
  try {
    const posts = await models.Board.findAll({
      where: {
        type: "board"
      }
    });
    res.json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const boardListQna = async (req, res) => {
  try {
    const posts = await models.Board.findAll({
      where: {
        type: "qna"
      }
    });
    res.json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const boardListNotice = async (req, res) => {
  try {
    const posts = await models.Board.findAll({
      where: {
        type: "notice"
      }
    });
    res.json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const boardWriteApi = (req, res) => {
  if (req.cookie_id) {
    models.Board.create({
      title: req.body.title,
      content: req.body.content,
      count: 0,
      User: req.cookie_name,
      type: req.body.type,
    })
  }
};

const boardListToDetailApi = (req, res) => {
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
}

const boardDeleteApi = (req, res) => {
  const id = req.params.id;

  models.Board.findOne({
    where: {
      id: id
    }
  })
    .then(board => {
      if (board.User == req.name) {
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
      }
      else {
        return res.status(200).send("작성자가");
      }
    })

}

const boardUpdateApi = async (req, res) => {
  try {
    const id = req.params.id;
    models.Board.findOne({
      where: {
        id: id
      }
    })
      .then(board => {
        if (board.User == req.id) {
          const updateData = req.body;

          // 비동기적으로 데이터베이스 업데이트를 수행
          const updatedRows = models.Board.update(updateData, {
            where: {
              id: id
            }
          });

          if (updatedRows > 0) {
            res.status(200).send("Success");
          } else {
            return res.status(404).send("Not found"); // 업데이트된 행이 없을 경우 처리할 내용
          }
        }
        else {
          return res.status(200).send("작성자가 아닙니다.")
        }
      })

  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error"); // 에러 발생 시 처리할 내용
  }
};

const loadBoardApi = async (req, res) => {
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
}

const createCommentApi = async (req, res) => {
  console.log(req.body);
  if (req.cookie_id) {
    try {
      await models.Comment.create({
        comment_user_id: req.cookie_name,
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
};

const commentListApi = (req, res) => {
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
}

module.exports = {
  boardListApi,
  boardWriteApi,
  boardListToDetailApi,
  boardDeleteApi,
  boardUpdateApi,
  loadBoardApi,
  createCommentApi,
  commentListApi,
  boardListBoard,
  boardListQna,
  boardListNotice,
}