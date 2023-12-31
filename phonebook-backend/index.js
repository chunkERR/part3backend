const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()


const Person = require('./models/person')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    const errors = {};

    // Extract individual validation errors
    for (let field in error.errors) {
      errors[field] = error.errors[field].message;
    }

    return response.status(400).json({ error: errors });
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(cors())
app.use(requestLogger)


morgan.token('data', (req, res) => JSON.stringify(req.body))


app.get('/api/persons', (request, response, next) => {
  Person.find({}).
  then(persons => {
    response.json(persons)
  })
  .catch(error => next(error))
})


app.get('/api/info', (request, response, next) => {
  Person.countDocuments({})
  .then(count => {
    const requestTime = new Date();
    const info = `<p>Phonebook has info for ${count} people.<br/>${requestTime.toISOString()}</p>`;
    response.send(info);
  })
.catch(error => next(error))
})


app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});


app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  Person.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end();
    })
    .catch(error => next(error));
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

      person
      .save()
      .then(savedPerson => {
        response.json(savedPerson);
      });
    })
    .catch(error => next(error));
    });


    app.put('/api/persons/:id', (request, response, next) => {
      const { name, number } = request.body;
    
      Person.findOne({ name: name })
        .then((existingPerson) => {
          if (!existingPerson) {
            return response.status(404).json({ error: 'Person not found' });
          }
    
          Person.findByIdAndUpdate(
            request.params.id,
            { name, number },
            { runValidators: true, context: 'query' }
          )
            .then((updatedPerson) => {
              response.json(updatedPerson);
            })
            .catch((error) => next(error));
        })
        .catch((error) => next(error));
    });
    

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
