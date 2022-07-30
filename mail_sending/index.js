const express = require("./config/express");

const server = express();
const port = 3001;
server.listen(port, () => {
  console.log(`🔥Server Is Running At Port ${port}🔥`);
});
