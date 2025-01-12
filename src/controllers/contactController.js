exports.index = (req, res) => {
    console.log(req.flash('info'));
    res.send('Obrigado por entrar em <b>contato</b> com a gente !');
};