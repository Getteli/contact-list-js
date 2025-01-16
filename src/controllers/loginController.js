const Login = require('../models/LoginModel');

exports.index = (req, res) =>
{
    // se ja tiver logado, envia para a home
    if(req.session?.user)
    {
        return res.redirect('/');
    }

    res.render('login');
};

exports.login = async (req, res) =>
{
    try
    {
        const login = new Login(req.body, true);

        await login.logar();

        if(login.errors.length > 0)
        {
            req.flash('errors',login.errors);
            req.session.save(function(){
                res.redirect('back');
            });
            return;
        }

        req.session.user = login.user;
        req.session.save(function(){
            res.redirect('/');
        });
        return;
    }
    catch (error)
    {
        console.log(error);
        return res.render('login',{mensagem: 'Erro ao tentar cadastrar a conta', code: 500});
    }
};


exports.logout = async (req, res) =>
{
    try
    {
        req.session.destroy();
        res.redirect('login');
    }
    catch (error)
    {
        console.log(error);
        return res.redirect('/',{mensagem: 'Erro ao tentar deslogar da sessão', code: 500});
    }
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
        return res.render('login',{mensagem: 'Erro ao tentar cadastrar a conta', code: 500});
    }
};