// chama o env
require('dotenv').config();

const express = require('express');
// init server web
const app = express();
const routes = require('./routes');
const path = require('path');
// const helmet = require('helmet');
const csurf = require('csurf');
const {
    checkCsrfError,
    sendCsrfToken
} = require('./src/middlewares/middleware');

// conexao com o db
const mongoose = require('mongoose');
// session
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash =  require('connect-flash');

// conectando (com o link disponibilizado pelo mongodb)
mongoose.connect(process.env.DBCONNECTIONSTRING)
.then(() => {
    console.log('Connected to MongoDB');
    // no retorno da promisse do mongodb emitimos o alerta de que esta pronto
    app.emit('ready'); // pode ser qlq msg
});

const SessionOptions = session({
    secret: process.env.SESSIONSECRET,
    store: MongoStore.create({ mongoUrl: process.env.DBCONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 1, // 1 dia
        httpOnly: true,
    }
});

app.use(SessionOptions);
app.use(flash());
// tokenizacao
// app.use(helmet());

// tratando o body de post
app.use(express.urlencoded({ extended: true }));

// chama os conteudos estaticos
app.use(express.static(path.resolve(__dirname, 'public')));

// para usar views, seta o caminho da pasta views para qualquer coisa que usar o render pegar o nome do arquivo dessa pasta
app.set('views',path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs'); // esas engine é a mais parecida com um html depois de gerado

// tokenizacao
app.use(csurf());

// chamando os middleware globais para todas as rotas
app.use(checkCsrfError);
app.use(sendCsrfToken);

// para usar as rotas
app.use(routes);

// agora so vai começar a ouvir a porta depois que a conexao com o banco for estabelecida
app.on('ready', () => {
    // listen port
    app.listen(80, () => {
        console.log('Server running on port 80');
    });
})