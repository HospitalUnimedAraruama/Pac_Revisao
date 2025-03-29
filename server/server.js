import express from 'express';
import oracledb from 'oracledb';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = 3001;
const data = new Date()

app.use(cors()); // Permite o React acessar o backend
app.use(express.json());

oracledb.initOracleClient({ libDir: 'C:\\oracle_vsc\\product\\bin' });

async function connectDatabase() {
  try {
    const connection = await oracledb.getConnection({ user: "dbazinho", password: "borrachinha,290", connectionString: "10.118.2.42/prdmv" });
    return connection;
  } catch (err) {
    console.error('Erro ao conectar:', err);
  }
}

const currentDate = new Date();
const formattedDate = currentDate.toLocaleDateString('pt-BR');
console.log(formattedDate);



app.get('/api/data', async (req, res) => {
  const connection = await connectDatabase();
  if (!connection) {
    return res.status(500).json({ error: 'Erro ao conectar ao banco de dados' });
  }

  try {
    const result = await connection.execute(
      `SELECT
      TR.CD_ATENDIMENTO,
      TR.TP_RASTREAMENTO,
      TR.NM_PACIENTE,
      TR.CD_TRIAGEM_ATENDIMENTO
      FROM
          DBAMV.TRIAGEM_ATENDIMENTO TR,
          ATENDIME
      WHERE
          TR.CD_ATENDIMENTO = ATENDIME.CD_ATENDIMENTO
      AND ATENDIME.CD_MULTI_EMPRESA = 1
      AND ATENDIME.CD_ORI_ATE IN (1)
      AND ATENDIME.DT_ALTA IS NULL
      AND TR.TP_RASTREAMENTO = 'AGUARDANDO'
      AND TRUNC(ATENDIME.DT_ATENDIMENTO) = TO_DATE(:data, 'DD/MM/YYYY')
      ORDER BY 1 DESC`,
        { data: formattedDate } 
      );

    await connection.close();
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/update-status', async (req, res) => {
  const { atendimento, status } = req.body;


  console.log(atendimento, status);
  

  if (!atendimento || !status) {
    return res.status(400).json({ error: 'Número do atendimento e status são obrigatórios'});
  }

  const connection = await connectDatabase();
  if (!connection) {
    return res.status(500).json({ error: 'Erro ao conectar ao banco de dados' });
  }

  try {
    const result = await connection.execute(
      `UPDATE DBAMV.TRIAGEM_ATENDIMENTO 
       SET TP_RASTREAMENTO = :status 
       WHERE CD_ATENDIMENTO = :atendimento`,
      { status, atendimento },
      { autoCommit: true }
    );

    await connection.close();

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Atendimento não encontrado' });
    }

    res.json({ message: 'Status atualizado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
