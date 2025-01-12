// criando um model com base no mongoose
const mongoose = require('mongoose')
// para criar
// HomeModel.create({
//     title: 'tituloteste',
//     description: 'Hello World',
// }).then((data) => {
//     console.log('Home criada com sucesso');
//     console.log(data);
// }).catch(err => {
//     console.error('Erro ao salvar home', err);
// });

// para buscar
// HomeModel.find().then((data) => {
//     console.log('Busca feita:');
//     console.log(data);
// }).catch(err => {
//     console.error('Erro ao salvar home', err);
// });

// cria o schema, mongodb é nosql, nao tem estruturação, fica a cargo do back tratar antes de enviar
const HomeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// cria a instancia de model
const HomeModel = mongoose.model('Home', HomeSchema);

// a classe vai ser responsavel por fazer o CRUD e outros metodos necessarios
class Home
{
    // aqui usamos a instancia do mongo
}

// exporta a classe
module.exports = Home;