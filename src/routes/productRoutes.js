// Importa o framework Express
const express = require("express");

// Cria um objeto de rotas isolado
// Isso permite organizar o código e depois importar no app.js
const router = express.Router();

// Importa o Model Product
// Esse model representa a tabela de produtos no MySQL
const Product = require("../models/Product");

// 🔹 LISTAR PRODUTOS (SELECT)
// GET /products
// Lista todos os produtos cadastrados no banco
router.get("/", async (req, res) => {
  try {
    // Busca todos os registros da tabela products
    const products = await Product.findAll();

    // Retorna os dados em JSON com status 200 (OK)
    return res.status(200).json(products);
  } catch (error) {
    // Se der erro no banco ou no Sequelize
    return res.status(500).json({
      error: error.message,
    });
  }
});

// 🔹 CRIAR PRODUTO (INSERT)
// POST /products
// Cria um novo produto no banco
router.post("/", async (req, res) => {
  // Extrai os campos enviados no body da requisição
  const {
    item_id,
    model_id,
    nome_produto,
    estoque_atual,
    estoque_promocional,
    localizacao,
  } = req.body;
  // 📌 Aqui:
  // req.body vem do front (ou Postman)
  // Os nomes batem exatamente com as colunas do MySQL

  if (!nome_produto || estoque_atual == null) {
    return res
      .status(400)
      .json({ error: "Campos obrigatórios não informados" });
    // 🧠 Por que isso é importante
    // Banco não deve receber lixo
    // Front pode falhar
    // Usuário pode enviar coisa errada
  }

  try {
    // Cria o registro no banco (INSERT)
    const product = await Product.create({
      item_id,
      model_id,
      nome_produto,
      estoque_atual,
      estoque_promocional,
      localizacao,
    });

    // Retorna o produto criado
    // 201 = recurso criado com sucesso
    return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

// PUT /products/:item_id
// Atualiza um produto existente
router.put("/:item_id", async (req, res) => {
  // item_id vem da URL
  const { item_id } = req.params;

  try {
    // Busca o produto pelo item_id
    const product = await Product.findOne({
      where: { item_id },
    });
    // Se não encontrar o produto
    if (!product) {
      return res.status(404).json({
        error: "Produto não encontrado",
      });
    }
    // Atualiza apenas os campos enviados
    await product.update(req.body);

    // Retorna o produto atualizado
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

// DELETE /products/:item_id
// Remove um produto do banco
router.delete("/:item_id", async (req, res) => {
  const { item_id } = req.params;

  try {
    const product = await Product.findOne({
      where: { item_id },
    });
    if (!product) {
      return res.status(404).json({
        error: "Produto não encontrado",
      });
    }
    // Remove o registro do banco
    await product.destroy();

    // 204 = sucesso sem conteúdo
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});
