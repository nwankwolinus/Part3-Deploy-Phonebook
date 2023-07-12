const express = require('express')
const app = express()
var morgan = require('morgan')
app.use(express.json())
const cors = require('cors')

app.use(cors())

morgan.token("payload", function (req) {
    return JSON.stringify(req.body)
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :payload"))

let persons = [
    { 
        id: 1,
        name: "Arto Hellas", 
        number: "040-123456"
    },
    { 
        id: 2,
        name: "Ada Lovelace", 
        number: "39-44-5323523"
    },
    { 
        id: 3,
        name: "Dan Abramov", 
        number: "12-43-234345"
    },
    { 
        id: 4,
        name: "Mary Poppendieck", 
        number: "39-23-6423122"
    }
]

app.get("/info", (req, res, next) => {
    const requestTime = new Date(Date.now())
    res.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${requestTime}</p>`)
})

app.get('/api/persons', (request, response) => {
response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
        return maxId + 1
        }
    
        app.post('/api/persons', (request, response) => {
            const body = request.body
        
        if (!body.name) {
            return response.status(400).json({ 
                error: 'name is missing' 
            })
        }
    
        if (!body.number) {
            return response.status(400).json({ 
                error: 'number is missing' 
            })
        }
        
        const person = {
            name: body.name,
            number: body.number,
            id: generateId(),
        }
        
        persons = persons.concat(person)
    
        response.json(person)
    })


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})
