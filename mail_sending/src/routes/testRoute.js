module.exports = function (app) {
  const test = require("../controllers/testController");

  // 메일 전송
  app.post("/sendMail", test.sendMail);

  // 유저 등록
  app.post("/email", test.saveEmail);

  // 유저 구독 취소
  app.post("/email/drop", test.dropEmail);

  // 유저 정보 조회
  app.get("/users", test.getUser);

  app.get("/main", function (req, res) {
    res.sendFile(__dirname + "/pactice.html");
  });

  app.get("/style.css", function (req, res) {
    res.sendFile(__dirname + "/style.css");
  });

  app.get("/check.js", function (req, res) {
    res.sendFile(__dirname + "/check.js");
  });
};
