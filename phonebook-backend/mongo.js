const mongoose = require('mongoose')

const password = process.argv[2]

const url =
  `mongodb+srv://osuchowskijakub:${password}@cluster0.psyqnoc.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 5) {
    Person.find({})
      .then(persons => {
        console.log("Phonebook:");
        persons.forEach(person => {
          console.log(person);
        });
        mongoose.connection.close();
        process.exit(1);
      })
    }

const name = process.argv[3];
const number = process.argv[4];
    
    if (!name || !number) {
      console.log('Please provide both name and number as arguments.');
      mongoose.connection.close();
      process.exit(1);
    }

const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
})

person.save().then(result => {
    console.log('contact saved!')
    mongoose.connection.close()
  })
  .catch(error => {
    console.error('Error saving contact:', error);
    mongoose.connection.close();
  });