const baseResponse = require("../../config/baseResponseStatus");
const { response, errResponse } = require("../../config/response");
const secret_config = require("../../config/secret");
const nodemailer = require("nodemailer");
const senderInfo = require("../../config/senderInfo.json");
const mailer = require("../routes/mail");
const { prisma } = require("../util/util");

// 이메일 전송
exports.sendMail = async function (req, res) {
  const { title, link, text_info, date, department } = req.body;

  const email = req.query.email;

  //data를 html로 잘 꾸미기
  function getHtml(param = { title, link, text_info, date, department }) {
    return `
      <div>
      <head>
      <a href=${param.link}>
        <h1>
          ${param.title} 
        </h1>
        </a>
        from [${param.department}]  (${param.date})
      </head>
      </div>

      <div>
        <body>
        -------------------------------------------
        <br>
          ${param.text_info}
        <br>
        -------------------------------------------
        </body>
      </div>
      `;
  }

  let emailParam = {
    toEmail: email, // 수신할 이메일

    subject: "New notice for you", // 메일 제목

    text: `KUCC x YCC hackathon 7조에서 보냈습니다~`, // 메일 내용

    html: getHtml({ title, link, text_info, date, department }),
  };
  mailer.sendGmail(emailParam);
  return res.send(response(baseResponse.SUCCESS));
};

// user 정보 저장
exports.saveEmail = async function (req, res) {
  const { email, keyword } = req.body;

  let flag = await prisma.user.findMany({
    where: {
      email: email,
    },
  });

  // 유저가 없을 때
  if (!flag[0]) {
    // 유저 생성
    flag2 = await prisma.user.create({
      data: {
        email: email,
      },
    });

    keyword.forEach(async (element) => {
      // 해당 유저로 keyword 삽입
      await prisma.keyword.create({
        data: {
          keyword: element,
          userId: flag2.userId,
        },
      });
    });
  } else {
    keyword.forEach(async (element) => {
      // 유저가 있을 때
      // 해당 유저에 이미 keyword가 있으면 삽입 x
      const checkKeyword = await prisma.keyword.findMany({
        where: {
          keyword: element,
          userId: flag[0].userId,
        },
      });
      // 없으면 삽입
      if (checkKeyword.length == 0) {
        await prisma.keyword.create({
          data: {
            keyword: element,
            userId: flag[0].userId,
          },
        });
      }
    });
  }

  return res.send(response(baseResponse.SUCCESS));
};

exports.getUser = async function (req, res) {
  const result = await prisma.user.findMany({
    include: {
      Keyword: true,
    },
  });

  return res.send(result);
};

// 구독 취소
exports.dropEmail = async function (req, res) {
  const { email, keyword_arr } = req.body;
  const keyword = keyword_arr[0];

  //user 정보 가져오기
  let flag = await prisma.user.findMany({
    where: {
      email: email,
    },
  });

  //해당 email로 user가 없다면
  if (flag.length == 0) {
    return res.send(errResponse(baseResponse.EMAIL_DO_NOT_EXIST));
  }

  //해당 user가 전달 받은 keyword를 가지고 있는지 확인
  const keyword_list = await prisma.keyword.findMany({
    where: {
      userId: flag[0].userId,
      keyword: keyword,
    },
  });

  if (keyword_list.length == 0) {
    return res.send(errResponse(baseResponse.KEYWORD_DO_NOT_EXIST));
  } else {
    const get_id = await prisma.keyword.findMany({
      where: {
        keyword: keyword,
        userId: flag[0].userId,
      },
    });
    await prisma.keyword.delete({
      where: {
        id: get_id[0].id,
      },
    });
  }

  // 해당 user에 남은 keyword 확인
  const another_keyword = await prisma.keyword.findMany({
    where: {
      userId: flag[0].userId,
    },
  });

  // 해당 user에 더 이상 keyword가 없다면 user 삭제
  if (another_keyword.length == 0) {
    await prisma.user.delete({
      where: {
        userId: flag[0].userId,
      },
    });
  }

  return res.send(response(baseResponse.SUCCESS));
};
