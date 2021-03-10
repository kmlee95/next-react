const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const hpp = require('hpp');
const helmet = require('helmet');

const postRouter = require('./src/routes/post');
const postsRouter = require('./src/routes/posts');
const userRouter = require('./src/routes/user');
const hashtagRouter = require('./src/routes/hashtag');
const passportConfig = require('./src/passport');
const db = require('./models');

const app = express();
dotenv.config();
//front에서 보낸 데이터를 req.body에 넣어주는 역활
app.use(express.json()); //axios로 데이터 보내는 형식
app.use(express.urlencoded({ extended: true })); //form submit 했을 때 url encoded방식 처리
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
      domain: process.env.NODE_ENV === 'productiion' && '.snschat.com',
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use('/', express.static(path.join(__dirname, 'uploads')));

db.sequelize
  .sync()
  .then(() => {
    console.log('db연결성공!');
  })
  .catch(console.error);

passportConfig();

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
  app.use(hpp());
  app.use(helmet());
} else {
  app.use(morgan('dev')); //프론트에서 어떤요청이 왔는지 확인 가능
}

app.use(
  cors({
    origin: ['http://localhost:3060', 'snschat.com'],
    credentials: true, //쿠키도 전달
  }),
);
app.get('/', (req, res) => {
  res.send('hello express');
});
app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.use('/user', userRouter);
app.use('/hashtag', hashtagRouter);

//보통 에러처리 미들웨어는 숨겨져 있다. next(err)로 실행되는데 바꾸고싶으면 에러처리 미들웨어 따로 만들어준다.

app.listen(80, () => {
  console.log('서버 실행중');
});
