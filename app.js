require("dotenv-flow").config()
const qCommands = require("./query")
const inquirer = require("inquirer")
const express = require("express")
const cors = require("cors")
const app = express()
const qs = require("qs")
const bodyParser = require('body-parser')
const autoindex = require("express-autoindex")

app.set("query parser",
    (str) => qs.parse(str)
)
app.use(cors())
app.use("/cdn", express.static("images"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use("/", express.static("test"))
app.use("/api", express.static("test"))
app.use("/cdn", autoindex("images"))

app.disable('x-powered-by');

const port = process.env.PORT

app.get("/api/trips", (req, res) => {
    res.set('Content-Type', 'application/json');
    if (req.query?.q) {
        let from = ['tr.departure_site', 'tr.arrival_site', 'tr.departure_date']
        let parsed = JSON.parse(req.query.q)
        let values = [parsed.from, parsed.to, parsed.date]
        if (values.some((el) => el == "")) return
        qCommands.selectWhereJoin('', from, values).then(sel => {
            res.send(sel)
        })
    } else if (req.query?.ex) {
        qCommands.selectWhereJoin(`WHERE tr.id NOT IN (${req.query.ex})`).then((sel) => {
            res.send(sel)
        })
    } else {
        qCommands.selectWhereJoin().then((sel) => {
            res.send(sel)

        })
    }
})
app.get("/api/terminals", (req, res) => {
    res.set('Content-Type', 'application/json');
    qCommands.select("*", "terminal").then((sel) => {
        res.send(sel)
    })
})
app.get("/api/buses", (req, res) => {
    res.set('Content-Type', 'application/json');
    qCommands.select("*", "bus").then((sel) => {
        res.send(sel)
    })
})

app.post("/api/trips", (req, res) => {
    res.set('Content-Type', 'application/json');
    let q = [req.body.departure_site, req.body.arrival_site, req.body.departure_time, req.body.arrival_time, req.body.price, req.body.departure_date, req.body.bus_id, req.body.terminal_id]
    let notInsert = false
    for (let i = 0; i < q.length; i++) { if (q[i] == undefined || q[i] == '') { notInsert = true; break; }; }
    if (notInsert) return
    qCommands.autoinsert(q, "trip").then(sel => {
        qCommands.selectwhere("*", "trip", ["id"], [sel[0].id]).then((sel) => {
            res.send(sel)
        })

    })
})

app.delete("/api/trips", (req, res) => {
    qCommands.truncate("trip").then(sel => {
        res.send(sel)
    })
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
    qCommands.autoinsert(query, "trip")
});
*/
app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:3000`)
})





