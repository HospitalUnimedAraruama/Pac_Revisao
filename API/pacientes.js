
import oracledb from 'oracledb';
import bancoMv from './db.js';


async function listaPaciente(){

    try {
        const result = await bancoMv.execute(
            // `SELECT
            //     TR.CD_ATENDIMENTO,
            //     TR.TP_RASTREAMENTO,
            //     TR.NM_PACIENTE,
            //     TR.CD_TRIAGEM_ATENDIMENTO
            // FROM
            //     DBAMV.TRIAGEM_ATENDIMENTO TR,
            //     ATENDIME
            // WHERE
            //     TR.CD_ATENDIMENTO = ATENDIME.CD_ATENDIMENTO
            // AND ATENDIME.CD_MULTI_EMPRESA = 1
            // AND ATENDIME.CD_ORI_ATE IN (1)
            // AND ATENDIME.DT_ALTA IS NULL
            // ORDER BY 1 DESC`,
            // { data: '19/03/2025' } 
          );
    
          
          console.log(result);
          
          
        await bancoMv.close();
      } catch (err) {
       console.error({ error: err.message });
      }
}


export default {
    listaPaciente
}