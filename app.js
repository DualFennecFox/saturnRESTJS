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

app.disable('x-powered-by');

const port = process.env.PORT

const url = `https://saturnrest.onrender.com/`; 
const interval = 30000;

function reloadWebsite() {
    fetch(url)
        .then(response => {
            console.log(`Reloaded at ${new Date().toISOString()}: Status Code ${response.status}`);
        }, err => console.error(`Error reloading at ${new Date().toISOString()}:`, error.message))
        .catch(error => {
            console.error(`Error reloading at ${new Date().toISOString()}:`, error.message);
        });
}

setInterval(reloadWebsite, interval);

app.get("/api/trips", (req, res) => {
    if (req.query?.q) {
        let from = ['depsite', 'arrsite', 'depdate']
        let parsed = JSON.parse(req.query.q)
        let values = [parsed.from, parsed.to, parsed.date]
        if (values.some((el) => el == "")) return
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
    let q = [req.body.depsite, req.body.arrsite, req.body.departure, req.body.arrival, req.body.price, req.body.bus, req.body.bus, 5, req.body.depdate]
    let notInsert = false
    console.log(q)
    for (let i = 0; i < q.length; i++) { if (q[i] == undefined || q[i] == '') { notInsert = true; break; }; }
    if (notInsert) return
    qCommands.autoinsert(q, "trips").then(sel => {
        qCommands.selectwhere("*", "trips", ["id"], [sel[0].id]).then((sel) => {
            res.send(sel)
        })

    })
})

app.delete("/api/trips", (req, res) => {
    qCommands.truncate("trips").then(sel => {
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
    qCommands.autoinsert(query, "trips")
});
*/
app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:3000`)
})





