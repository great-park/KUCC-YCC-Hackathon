const express = require("express");
const compression = require("compression");
const methodOverride = require("method-override");
var cors = require("cors");
module.exports = function () {
  const app = express();

  //웹서버가 웹브라우저에게 응답할 때 그 데이터를 압축(gzip 방식)하는 미들웨어 담당!
  app.use(compression());
  app.use(express.json());

  // extended 옵션 - true : qs모듈을 사용(추가 설치) , false는 내장된 querystring모듈을 사용
  app.use(express.urlencoded({ extended: true }));
  app.use(methodOverride());

  let corsOptions = {
    origin: "*",
    Credential: true,
  };
  app.use(cors(corsOptions));

  require("../src/routes/testRoute")(app);

  return app;
};
