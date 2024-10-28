require("dotenv-flow").config()
const qCommands = require("./query")
const inquirer = require("inquirer")
const express = require("express")
const cors = require("cors")
const app = express()
const qs = require("qs")
const bodyParser = require('body-parser')

app.set("query parser",
    (str) => qs.parse(str)
)
app.use(cors())
app.use("/cdn", express.static("images"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/api/trips", (req, res) => {
    if (req.query?.q) {
        let from = ['depsite', 'arrsite', 'depdate']
        let parsed = JSON.parse(req.query.q)
        let values = [parsed.from, parsed.to, parsed.date]
        if (values.some((el) => el == "" )) return
        qCommands.selectwhere("*", "trips", from, values).then(sel => {
            res.send(sel)
        })
    } else if (req.query?.ex) {
        qCommands.select("*", `trips WHERE id NOT IN (${req.query.ex})`, 50).then((sel) => {
            res.send(sel)
        })
    } else {
        qCommands.select("*", "trips").then((sel) => {
            res.send(sel)

        })
    }
})

app.post("/api/trips", (req, res) => {
    let q = [req.body.from, req.body.to, req.body.date]
    qCommands.autoinsert(q, "trips")
})

let values = []
/*
const questions = [
    {
        type: 'input',
        name: 'name',
        message: "Nombre: ",
    },
    {
        type: 'input',
        name: 'lastname',
        message: "Apellido: ",
    },
    {
        type: 'input',
        name: 'email',
        message: "Correo: ",
    },
    {
        type: 'input',
        name: 'phone',
        message: "Numero de telefono: ",
    },
    {
        type: 'input',
        name: 'compliants',
        message: "Compliants: ",
    },
];


inquirer.default.prompt(questions).then(answers => {
    for (let i = 0; i < Object.values(answers).length; i++) {
        values.push(`'${Object.values(answers)[i]}'`)

    }
    const query = `(${values.join(", ")})`
    qCommands.autoinsert(query, "trips")
});
*/
app.listen(3000, () => {
    console.log(`Servidor iniciado en http://localhost:3000`)
})





