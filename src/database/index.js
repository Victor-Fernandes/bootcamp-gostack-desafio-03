// fazer conexao com o bd e conectar com os models
import Sequelize from 'sequelize';
import User from '../app/models/User';
import File from '../app/models/File';
import configDB from '../config/database';
import Meetup from '../app/models/meetup';

const models = [User, File, Meetup];

class Database {
  constructor() {
    this.connection = new Sequelize(configDB);
    this.init();
    this.associate();
  }

  init() {
    // Usando forEach por manipular os dados reais,
    models.forEach(model => model.init(this.connection));
  }

  associate() {
    models.forEach(model => {
      if (model.associate) {
        model.associate(this.connection.models);
      }
    });
  }
}

export default new Database();
