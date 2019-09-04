require('dotenv/config');

module.exports = {
  // Instalar pg e pg-hstore para usar o postgres
  // https://sequelize.org/master/manual/dialects.html
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  define: {
    timestamps: true,
    underscored: true,
    undersoredAll: true,
  },
};
