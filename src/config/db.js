// src/config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config(); // garante que o .env seja carregado

// Criação da conexão com Sequelize
const sequelize = new Sequelize(
    process.env.DB_NAME,      // nome do banco
    process.env.DB_USER,      // usuário
    process.env.DB_PASSWORD,  // senha
    {
        host: process.env.DB_HOST,  // host do banco
        dialect: 'mysql',           // tipo do banco (MySQL)
        port: process.env.DB_PORT || 3306,
        logging: false
    }
);

module.exports = sequelize;
