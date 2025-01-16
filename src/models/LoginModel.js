// criando um model com base no mongoose
const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')

// cria o schema, mongodb é nosql, nao tem estruturação, fica a cargo do back tratar antes de enviar
const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// cria a instancia de model
const LoginModel = mongoose.model('Login', LoginSchema);

// a classe vai ser responsavel por fazer o CRUD e outros metodos necessarios
class Login
{
    // aqui usamos a instancia do mongo
    constructor(body, isLogin = false)
    {
        this.body = body;
        this.errors = [];
        this.user = null;
        this.isLogin = isLogin;
    }

    /**
     * Registra no banco
     */
    async register()
    {
        this.validate();
        if (this.errors.length > 0) return;

        await this.userExists();
        if (this.errors.length > 0) return;

        // encripta o password
        this.body.password = await bcryptjs.hashSync(this.body.password, bcryptjs.genSaltSync());

        // se não tiver erros, cria o usuario no banco
        this.user = await new LoginModel(this.body);
        return this.user.save();    
    }

    async logar()
    {
        this.validate();
        if (this.errors.length > 0) return;

        this.user = await LoginModel.findOne({ email: this.body.email });

        if (!this.user)
        {
            this.errors.push('Usuário não encontrado');
            this.user = null;
            return;
        }

        // compara a senha digitada com a que esta no banco
        const match = await bcryptjs.compareSync(this.body.password, this.user.password);

        if (!match)
        {
            this.errors.push('Senha incorreta');
            this.user = null;
            return;
        }
    }

    /**
     * Valida os dados que vem do formulario
     */
    validate()
    {
        this.cleanUp();
        // email precisa ser valido
        // nome precisa ter pelo menos 3 caracteres
        if (!this.body.email || this.body.email.length < 3 || !validator.isEmail(this.body.email))
        {
            this.errors.push('Email inválido: Precisa ser um email válido e maior que 3 caracteres');
        }

        if(!this.isLogin)
        {
            if (!this.body.name || this.body.name.length < 3)
            {
                this.errors.push('Nome inválido: O nome precisa ser maior que 3 caracteres');
            }
        }

        // senha precisa ter pelo menos 3 caracteres e menos que 10
        if (!this.body.password || (this.body.password.length < 3 || this.body.password.length > 10))
        {
            this.errors.push('Senha inválida: A senha precisa ter entre 4 e 10 caracteres');
        }
    }

    /**
     * Verifica se o usuário existe no banco de dados
     */
    async userExists()
    {
        const userExist = await LoginModel.findOne({ email: this.body.email });

        if(userExist)
        {
            this.errors.push('Este e-mail já foi cadastrado. Tente outro.');
        }
    }

    /**
     * Metodo para garantir que tudo o que vem do front é string
     */
    cleanUp()
    {
        for (let key in this.body)
        {
            if(typeof this.body[key] !== 'string')
            {
                this.body[key] = '';
            }
        }

        if(this.isLogin)
        {
            this.body = {
                email: this.body.email,
                password: this.body.password
            };
        }
        else
        {
            this.body = {
                name: this.body.name,
                email: this.body.email,
                password: this.body.password
            };
        }
    }
}

// exporta a classe
module.exports = Login;