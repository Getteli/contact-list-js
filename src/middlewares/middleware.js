exports.sendCsrfToken = (req, res, next) => {
    // envia o token
    res.locals.csrfToken = req.csrfToken();

    // envia a sessao
    
    res.locals.user = req.session?.user ?? null;

    // envia o errors
    res.locals.errors = req.flash('errors');
    // envia o sucesses
    res.locals.successes = req.flash('successes');
    next();
};

exports.checkCsrfError = (err, req, res, next) => {
    // se nao for enviado o token, manda para a pagina de erro
    if(err && err.code == 'EBADCSRFTOKEN')
    {
        return res.render('error',{mensagem: 'bad csrf error'});
    }

    next();
};