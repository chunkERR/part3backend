const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()


const Person = require('./models/person')

app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(cors())

morgan.token('data', (req, res) => JSON.stringify(req.body))

let persons = [

]

app.get('/api/persons', (request, response) => {
  Person.find({}).
  then(persons => {
    response.json(persons)
  })
})


app.get('/api/info', (request, response) => {
const requestTime = new Date()
request.requestTime = requestTime.toISOString()
response.send(
    `<p>Phonebook has info for ${persons.length} people.<br/>
    ${request.requestTime}
    </p>`,
    )
})


app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person =>  person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})


app.post('/api/persons', (request,response) => {
const body = request.body

if (!body.name || !body.number) {
  return response.status(400).json({
  error: 'contact information is missing'
  })
}

const existingNames = persons.map(p => p.name)
if (existingNames.includes(body.name)) {
    return response.status(400).json({
        error: 'name must be unique'
        })
      }

      const person = new Person({
        name: body.name,
        number: body.number
      })

      person.save().then(savedPerson => {
        response.json(savedPerson)
      })
})


app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
})

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }

  app.use(requestLogger)

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
