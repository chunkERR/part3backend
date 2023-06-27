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
  const id = request.params.id;
  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => {
      console.error('Error retrieving person:', error);
      response.status(500).json({ error: 'Server error' });
    });
});


app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  Person.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end();
    })
    .catch(error => {
      console.error('Error deleting person:', error);
      response.status(500).json({ error: 'Server error' });
    });
});



app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Contact information is missing',
    });
  }

  Person.findOne({ name: body.name })
    .then(existingPerson => {
      if (existingPerson) {
        return response.status(400).json({
          error: 'Name must be unique',
        });
      }

      const person = new Person({
        name: body.name,
        number: body.number,
      });

      person.save().then(savedPerson => {
        response.json(savedPerson);
      });
    })
    .catch(error => {
      console.error('Error saving person:', error);
      response.status(500).json({ error: 'Server error' });
    });
});



app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
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

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
