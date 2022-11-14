import {db, tableName, columnNames} from '../server/connection'

async function checkTimeout(userId: string, network: string, token: string){
    //get user record from db
    const query=`SELECT * FROM ${tableName} WHERE user_id = '${userId}';`
    const userRecord = await db.query(query)
    //user record exist?
    if(userRecord.length != 0) {
        const col = network+"_"+token
        const claimed = new Date(userRecord[0][col]).getTime()
        const oneday = 60 * 60 * 24 * 1000
        const now = new Date().getTime()
        //check if 24h have passed
        if(now-oneday > claimed){
            return true
        } else return false
    } else return true
}

async function updateRecord(userId: string, network: string, token: string){

    var query=`SELECT * FROM ${tableName} WHERE user_id = '${userId}';`
    const userRecord = await db.query(query)

    const now = new Date().toISOString()
    const col = network+"_"+token

    if(userRecord.length != 0) {
        //update 
        query = `UPDATE ${tableName} SET ${col}='${now}' WHERE user_id = '${userId}';`
        await db.query(query)
    } else  {
        //create a new record
        const defaultData= new Date("1970-01-01 00:00:01").toISOString()
        
        query = `INSERT INTO  ${tableName} (${columnNames}) VALUES('${userId}','${defaultData}','${defaultData}','${defaultData}','${defaultData}','${defaultData}')`
        await db.query(query)

        query = `UPDATE ${tableName} SET ${col}='${now}' WHERE user_id = '${userId}';`
        await db.query(query)
    }
}

export {checkTimeout, updateRecord}