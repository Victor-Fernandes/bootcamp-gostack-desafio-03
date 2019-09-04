// fazer conexao com o bd e conectar com os models
import Sequelize from 'sequelize';
import User from '../app/models/User';
import configDB from '../config/database';

const models = [User];

class Database {
  constructor() {
    this.connection = new Sequelize(configDB);
    this.init();
  }

  init() {
    // Usando forEach por manipular os dados reais,
    models.forEach(model => model.init(this.connection));
  }
}

export default new Database();
