require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.static('dist'))
const Person = require('./models/person')


const url = process.env.MONGODB_URI;


morgan.token('body', (req) => JSON.stringify(req.body))

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)
app.use(express.json())

app.use(cors())

// This part is commented out because we are now using the database

// let persons = [
//     { 
//       "id": "1",
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": "2",
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": "3",
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": "4",
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

// app.get('/info', (request, response) => {
//     response.send(`<p>Phonebook has info for ${persons.length} people</p>
//         <p>${new Date()}</p>`)
// })

// app.get('/api/persons/:id', (request, response) => {
//     const id = request.params.id
//     const person = persons.find(person => person.id === id)
    
//     if (person) {
//       response.json(person)
//     } else {
//       response.status(404).end()
//     }
//   })


// app.get('/api/persons', (request, response) => {
//     response.json(persons)
// })

// app.post('/api/persons', (request, response) => {
//     const body = request.body

//     if (!body.name) {
//         return response.status(400).json({ 
//             error: 'name missing' 
//         })
//     }

//     if (!body.number) {
//         return response.status(400).json({ 
//             error: 'number missing' 
//         })
//     }


//     if (persons.find(person => person.name === body.name)) {
//         return response.status(400).json({ 
//             error: 'name must be unique' 
//         })
//     }

//     const person = {
//         id: String(Math.floor(Math.random() * 1000000)),
//         name: body.name,
//         number: body.number
//     }

//     persons = persons.concat(person)
//     response.json(person)
// })

// app.delete('/api/persons/:id', (request, response) => {
//     const id = request.params.id
//     persons = persons.filter(person => person.id !== id)
//     response.status(204).end()
// })

app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons)
  })
})

app.get('/info', (req, res) => {
  Person.find({}).then((persons) => {
    const body = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p
    `
    res.send(body)
  })
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id)
    .then((person) => {
      res.json(person)
    })
    .catch((error) => {
      res.status(400).json({ error: error.message })
    })
})

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndDelete(req.params.id).then(() => {
    res.status(204).end()
  })
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedPerson) => {
      res.json(updatedPerson)
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  const person = new Person({
    name,
    number,
  })

  person
    .save()
    .then((person) => {
      res.json(person)
    })
    .catch((error) => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})