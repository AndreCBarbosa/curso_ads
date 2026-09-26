//npm install express
const express = require('express');
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'API funcionando' });
});

const { DATABASE_URL } = process.env;

// Usa SSL fora do ambiente local.
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: DATABASE_URL && !DATABASE_URL.includes('localhost') ? { require: true } : false,
});

async function getPgVersion() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT version()');
    console.log(result.rows[0]);
  } finally {
    client.release();
  }
}

// Confirma a conexão com o banco e registra a versão do PostgreSQL.
getPgVersion();

// Retorna o valor acumulado dos pagamentos para cada imóvel.
app.get('/get_total', async function (req, res) {
  try {
    const result = await pool.query(`
      SELECT codigo_imovel, valor_do_pagamento FROM pagamento
    `);

    var totais = {};

    result.rows.forEach((row) => {
      const codigo = String(row.codigo_imovel);
      const valor = Number(row.valor_do_pagamento) || 0;

      if (!totais[codigo]) {
        totais[codigo] = 0;
      }

      totais[codigo] += valor;
    });

    res.json(totais);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar informacoes' });
  }
});

app.get('/get_per_month', async function (req, res) {
  try {
    const result = await pool.query(`
      SELECT data_do_pagamento, valor_do_pagamento FROM pagamento
    `);

    var totais = {};

    result.rows.forEach((row) => {
      // Agrupa os pagamentos pela data formatada como mês e ano.
      const data = String(row.data_do_pagamento).slice(4, 7) + " " + String(row.data_do_pagamento).slice(11, 15);
      const valor = Number(row.valor_do_pagamento) || 0;

      if (!totais[data]) {
        totais[data] = 0;
      }

      totais[data] += valor;
    });

    res.json(totais);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar informacoes' });
  }
});

app.get('/get_per_type', async function (req, res) {
  try {
    // LEFT JOIN mantém na resposta os tipos e imóveis sem pagamentos.
    const result = await pool.query(`
      SELECT ti.id_tipo_imovel, ti.tipo_imovel, p.id_venda
      FROM tipo_imovel ti
      LEFT JOIN imovel i ON i.id_tipo_imovel = ti.id_tipo_imovel
      LEFT JOIN pagamento p ON p.codigo_imovel = i.codigo_imovel
      ORDER BY ti.id_tipo_imovel
    `);

    const tipos = new Map();

    result.rows.forEach((row) => {
      // Cria uma entrada para cada tipo, inclusive quando ainda não tem vendas.
      if (!tipos.has(row.id_tipo_imovel)) {
        tipos.set(row.id_tipo_imovel, {
          tipo_imovel: row.tipo_imovel,
          vendas: new Set(),
        });
      }

      // Um mesmo id_venda pode aparecer em vários pagamentos; Set evita duplicatas.
      if (row.id_venda !== null) {
        tipos.get(row.id_tipo_imovel).vendas.add(row.id_venda);
      }
    });

    const totalVendas = Array.from(tipos.values()).reduce(
      (total, tipo) => total + tipo.vendas.size,
      0
    );

    // Calcula a participação de cada tipo no total e evita divisão por zero.
    const percentuais = Array.from(tipos.values(), (tipo) => ({
      tipo_imovel: tipo.tipo_imovel,
      percentual: totalVendas === 0
        ? 0
        : Number(((tipo.vendas.size / totalVendas) * 100).toFixed(2)),
    }));

    res.json(percentuais);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar informacoes' });
  }
});

// Inicia o servidor HTTP na porta 3000.
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
