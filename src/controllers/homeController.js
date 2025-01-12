// importa o model
const HomeModel = require('../models/HomeModel');

exports.index = (req, res) => {
    // salvando a sessão no mongo - ele cria uma tabela com a sessao e com o tempo de expiração citado
    // req.session.usuario = {nome: 'Douglas', logado: true};

    // msg flash
    req.flash('info', 'ola mundo')

    // console.log(req.session.usuario);

    // acessando a sessao que foi iniciada no middleware anterior
    res.render('index',{
        titulo: "Titulo da pagina",
        numeros: [0,1,2,3,4,5,6,7,8,9,10]
    });
};

exports.sendForm = (req, res) => {
    // para ver o conteudo de um post é body
    // ps: precisa ser tratado
    console.table(req.body);
    let body = req.body;
    res.send(`
        <b>veja o console</b>
        <br>
        token: ${body._csrf}
        O numero enviado foi: ${body.numero}
    `);
};