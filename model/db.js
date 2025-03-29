import oracledb from "oracledb";
import dotenv from 'dotenv'
// dotenv.config()

oracledb.initOracleClient({ libDir: 'C:\\oracle_vsc\\product\\bin' });

export default async function connectDataBase(){
  // const PASSWORD = process.env.PASSWORD_CONECTION
  
  try{
    return await oracledb.getConnection({ user: "dbamv", password: "cat#iop!90", connectionString: "10.118.2.42/trnmv" });
  }
  catch(err){
    console.info(err);
  }
}