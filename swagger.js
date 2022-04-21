const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "CloneCode",
    description: "인스타 클로코딩",
  },
  host: "hyeonjun.shop",
  schemes: ["https"],
  tags: [
    {
      name: 'User',
      description: '회원관리 API',
      summary: '회원관리 API',
    },
    {
      name: 'Feed',
      description: '게시글관련 API',
      summary: '게시글관련 API',
    },
    {
      name: 'Comment',
      description: '댓글관련 API',
      summary: '댓글관련 API',
    },
    {
      name: 'Recomment',
      description: '대댓글관련 API',
      summary: '대댓글관련 API',
    },
  ],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
