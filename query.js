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

function listValues(values) {
    let num = ""
    for (let i = 0; i < values.length; i++) {
        num += `$${i + 1}, `

    }
    num = num.slice(0, -2)
    return num
}

async function autoinsert(values, table) {
    let columns = await getcolumns(table)
    let parameters = listValues(values)
    const insertquery = `INSERT INTO ${table}
    (${columns})
    VALUES 
    (${parameters}) RETURNING id;`
    console.log(insertquery)

    let res = await pool.query(insertquery, values)
    return res.rows
}

async function insert(columns, values, table) {
    let parameters = listValues(values)
    const insertquery = `INSERT INTO ${table}
    (${columns})
    VALUES 
    (${parameters});`

    let res = await pool.query(insertquery, values)
    return res
}

async function select(columns, table, limit = null) {

    const selectquery = `SELECT ${columns} FROM ${table} ${limit ? "ORDER BY id DESC" : ""} LIMIT $1 `;

    let res = await pool.query(selectquery, [limit])
    return res.rows
}

async function selectwhere(columns, table, from, values, limit = null) {
    let whereq = ""
    for (let i = 0; i < from.length; i++) {
        whereq += `${from[i]} = $${i + 2} AND `

    }
    whereq = whereq.slice(0, -4)

    const selectquery = `SELECT ${columns} FROM ${table} WHERE ${whereq} ${limit ? "ORDER BY id DESC" : ""} LIMIT $1 `;
    console.log([...values, ...from])
    let res = await pool.query(selectquery, [limit, ...values])

    return res.rows
}

async function truncate(table) {
    const truncatequery = `TRUNCATE ${table} RESTART IDENTITY CASCADE;`
    let res = await pool.query(truncatequery)

    return res
}

module.exports = {
    getcolumns,
    autoinsert,
    insert,
    select,
    selectwhere,
    truncate
}