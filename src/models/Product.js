// Importa os tipos de dados do Sequelize (STRING, INTEGER, DATE, etc.)
const { DataTypes } = require('sequelize');

// Importa a instância de conexão com o banco (MySQL)
const sequelize = require('../config/db');

/**
 * Model Product
 * Representa a tabela "produtos" no banco de dados
 */
const Product = sequelize.define('Product', {
    // ID principal do produto (vem do banco, ex: SKU)
    item_id: {
        type: DataTypes.STRING,   // Tipo VARCHAR no MySQL
        primaryKey: true,         // Define como chave primária
        unique: true,             // Garante que não haja duplicados
        allowNull: false          // Não permite valor nulo
    },

    // ID do modelo do produto (agrupador lógico)
    model_id: {
        type: DataTypes.INTEGER,  // INT no MySQL
        defaultValue: 0           // Valor padrão caso não seja enviado
    },

    // Nome descritivo do produto
    nome_produto: {
        type: DataTypes.STRING
    },

    // Quantidade disponível em estoque normal
    estoque_atual: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },

    // Quantidade reservada para promoções
    estoque_promocional: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },

    // Local físico do produto (ex: corredor, prateleira)
    localizacao: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'produtos',        // Nome exato da tabela no MySQL
    freezeTableName: true,        // Impede pluralização automática
    timestamps: true,             // Cria createdAt e updatedAt
    createdAt: 'createdAt',       // Nome da coluna de criação
    updatedAt: 'updatedAt'        // Nome da coluna de atualização
});

// Exporta o model para ser usado nas rotas
module.exports = Product;
