import pgPromise from 'pg-promise';

const pg = pgPromise({});
const db = pg("postgres://postgres:password@localhost:5432/postgres");
const tableName = "users_claims"
const columnNames = "user_id, goerli_eth,goerli_link,mumbai_matic,mumbai_link,alfajores_celo"

export {db, tableName, columnNames}