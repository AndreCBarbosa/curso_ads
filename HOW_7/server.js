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

getPgVersion();

app.get('/get_all', async function (req, res) {
  try {
    const result = await pool.query('SELECT * FROM pagamento');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar transacoes' });
  }
});

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

//Inicia o web server
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
