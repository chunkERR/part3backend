const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url =
  "mongodb+srv://osuchowskijakub:S006IeuCLTVsAa2W@cluster0.psyqnoc.mongodb.net/testNoteApp?retryWrites=true&w=majority";

mongoose.set("strictQuery", false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

const note = new Note({
  content: "note created for test database",
  important: false,
});

note.save().then((result) => {
  console.log("note saved!");
  mongoose.connection.close();
});

Note.find({}).then((result) => {
  result.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});
