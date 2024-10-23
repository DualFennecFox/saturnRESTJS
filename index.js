require("dotenv-flow").config()
const qCommands = require("./query")
const inquirer = require("inquirer")

let values = []

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
    qCommands.autoinsert(query, "customers")
});






