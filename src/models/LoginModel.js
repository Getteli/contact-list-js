// criando um model com base no mongoose
const mongoose = require('mongoose')
const validator = require('validator')

// para criar
// LoginModel.create({
//     title: 'tituloteste',
//     description: 'Hello World',
// }).then((data) => {
//     console.log('Login criada com sucesso');
//     console.log(data);
// }).catch(err => {
//     console.error('Erro ao salvar login', err);
// });

// para buscar
// LoginModel.find().then((data) => {
//     console.log('Busca feita:');
//     console.log(data);
// }).catch(err => {
//     console.error('Erro ao salvar login', err);
// });

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
    constructor(body)
    {
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    /**
     * Registra no banco
     */
    async register()
    {
        try
        {
            this.validate();

            if (this.errors.length > 0) return;
    
            // se não tiver erros, cria o usuario no banco
            this.user = await new LoginModel(this.body);
            return this.user.save();    
        }
        catch (error)
        {
            console.log(error);
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

        if (!this.body.name || this.body.name.length < 3)
        {
            console.log(this.body.name);
            this.errors.push('Nome inválido: O nome precisa ser maior que 3 caracteres');
        }

        // senha precisa ter pelo menos 3 caracteres e menos que 10
        if (!this.body.password || (this.body.password.length < 3 || this.body.password.length > 10))
        {
            this.errors.push('Senha inválida: A senha precisa ter entre 4 e 10 caracteres');
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

        this.body = {
            name: this.body.name,
            email: this.body.email,
            password: this.body.password
        };
    }
}

// exporta a classe
module.exports = Login;