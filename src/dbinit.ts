import { DatabaseService } from './Services/databaseService' ;

const databaseService=new DatabaseService()
async function main() {
  try {
    const { dbConnected} = await databaseService.checkIfDbConnected();
    if (dbConnected ){
      await databaseService.executeDbScripts();
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Error Occured`);
  }
}

main();
