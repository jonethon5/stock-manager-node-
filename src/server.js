/************************************************
 * IMPORTAÇÕES
 ************************************************/

// Importa o framework Express, usado para criar o servidor e definir rotas HTTP
const express = require("express");

// Middleware que libera o acesso à API por outros domínios (resolve problemas de CORS)
const cors = require("cors");

// Módulo nativo do Node para trabalhar com caminhos de arquivos de forma segura
const path = require("path");

// Conexão com o banco de dados (Sequelize configurado)
const sequelize = require("./config/db");

// Rotas relacionadas aos produtos
const ProductRoutes = require("./routes/productRoutes");

// Tipos de dados usados para definir models no Sequelize
const { DataTypes } = require("sequelize");

/************************************************
 * CRIAÇÃO DA APLICAÇÃO
 ************************************************/

// Cria a instância da aplicação Express
const app = express();

/************************************************
 * MIDDLEWARES GLOBAIS
 ************************************************/

// Permite que o front-end acesse a API
app.use(cors());

// Permite que o servidor leia JSON enviado no body das requisições
app.use(express.json());

// Serve arquivos estáticos (HTML, CSS, JS) da pasta front
app.use(express.static(path.join(__dirname, "../front")));



// ================================
// MODEL: Venda
// ================================


// Model responsável por registrar vendas no banco

const Venda = sequelize.define('Venda', {
    item_id: {
        type: DataTypes.STRING,
        allowNull: false // Não permite salvar venda sem item
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false // Quantidade é obrigatória
    },
    data_venda: {
        type: DataTypes.DATEONLY,
        allowNull: false // Data da venda (YYYY-MM-DD)
    }
});

// ================================
// ROTAS DA API
// ================================

// Registra uma nova venda
app.post('/api/vendas', async (req, res) => {
    try {
        const { item_id, quantidade, data_venda } = req.body;

        await Venda.create({
            item_id,
            quantidade,
            data_venda
        });

        res.status(201).json({
            success: true,
            message: 'Venda registrada com sucesso'
        });
    } catch (error) {
        console.error('Erro ao registrar venda:', error);
        res.status(500).json({ error: 'Erro ao registrar venda' });
    }
});

// Retorna o histórico completo de vendas
app.get('/api/vendas', async (req, res) => {
    try {
        const vendas = await Venda.findAll();
        res.json(vendas);
    } catch (error) {
        console.error('Erro ao buscar vendas:', error);
        res.status(500).json({ error: 'Erro ao buscar vendas' });
    }
});

// Conecta todas as rotas de produtos no caminho /products
app.use('/products', ProductRoutes);

// Rota simples para verificar se o servidor está online
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// ================================
// INICIALIZAÇÃO DO SERVIDOR
// ================================


// Sincroniza os models com o banco de dados
sequelize.sync()
    .then(() => {    // Executado quando o banco conecta e sincroniza corretamente
        console.log('✅ Banco sincronizado com sucesso');

        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
        });
    })
    .catch(error => {
        console.error('❌ Erro ao conectar no banco:', error);
    });