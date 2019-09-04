module.exports = {
  // Instalar pg e pg-hstore para usar o postgres
  // https://sequelize.org/master/manual/dialects.html
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'meetapp',
  define: {
    timestamps: true,
    underscored: true,
    undersoredAll: true,
  },
};
