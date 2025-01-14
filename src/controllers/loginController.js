const Login = require('../models/LoginModel');

exports.index = (req, res) =>
{
    res.render('login');
};

exports.login = (req, res) =>
{
    let body = req.body;
};

exports.register = async (req, res) =>
{
    try
    {
        const login = new Login(req.body);

        await login.register();

        if(login.errors.length > 0)
        {
            req.flash('errors',login.errors);
            req.session.save(function(){
                res.redirect('back');
            });
            return;
        }

        req.flash('successes','Usuário criado com sucesso !');
        req.session.save(function(){
            res.redirect('back');
        });
        return;
    }
    catch (error)
    {
        console.log(error);
        return res.render('error',{mensagem: 'Erro ao tentar cadastrar a conta', code: 500});
    }
};