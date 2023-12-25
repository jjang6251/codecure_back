# loginDbTest
 
#수정하고 나서 boardList로 안넘어감.(수정은 됨)

npm init
npm install express


alter database [DB명] default character set UTF8;
alter table [table명] convert to character set UTF8;

db, sequelize, 

sequelize model:generate --name User --attributes user_id:integer,user_name:string



sudo apt-get install ufw
sudo ufw enable
sudo ufw status
sudo ufw allow 3306
sudo ufw status
sudo reboot

로그인(코큐 회원인 사람만)
- 아이디
- 비밀번호
- 학번(학번당 한개만 만들 수 있음)
- 이름
- allow(false, true)


회원정보 보기(로그인 시에만)
- 회원 정보 + 비밀번호 변경 알고리즘.



관리자 계정 하나 만들기(is_superUser)

관리자 페이지(admin)
- 회원 삭제 기능
- 회원가입시 allow 부여(코큐 회원일 경우에만)
- 게시판 삭제 기능



게시판
- 게시판 종류, 제목(title), 내용(content), (글쓴이)Id, 수정은 글쓴이만 가능
- CRUD
- 





****데이터베이스****
회원가입
게시판
코큐 회원들(관리자)







게시판 구분: 일반, 공지사항, Q&A
today: 방문자수


//서버 배포시 node 버전 오류 났을 때
$ rm -rf node_modules/
$ npm update



curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash


source ~/.bashrc


nvm install node

nvm use node



