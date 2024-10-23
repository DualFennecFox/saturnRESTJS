const { Pool } = require("pg")

const pool = new Pool()

async function getcolumns(table) {
    let res = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name = '${table}' AND column_name != 'id';`)
    let columns = ''
    for (let i = 0; i < res.rows.length; i++) {
        columns += res.rows[i]?.column_name + ", "

    }
    columns = columns.slice(0, -2)
    return columns
}

async function autoinsert(query, table) {
    let columns = await getcolumns(table)
    const insertquery = `INSERT INTO ${table}
    (${columns})
    VALUES 
    ${query}`
    
    let res = await pool.query(insertquery)
    pool.end()
    return res
}

async function insert(columns, query, table) {

    const insertquery = `INSERT INTO ${table}
    (${columns})
    VALUES 
    (${query})`

    let res = await pool.query(insertquery)
    pool.end()
    return res
}

async function select(columns, table) {
    const selectquery = `SELECT ${columns} FROM ${table}`

    let res = await pool.query(selectquery)
    pool.end()
    return res.rows
}






module.exports = {
    getcolumns,
    autoinsert,
    insert,
    select
}