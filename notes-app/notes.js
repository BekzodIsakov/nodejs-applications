const fs = require("fs");
const chalk = require("chalk");

const FILE_PATH = "./notes.json";

const loadNotes = () => {
  try {
    const notes = fs.readFileSync(FILE_PATH, "utf-8");
    return JSON.parse(notes);
  } catch (error) {
    return [];
  }
};

const saveNotes = (notes) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(notes));
};

const addNote = (title, body) => {
  const notes = loadNotes();
  const duplicateNote = notes.find((note) => note.title === title);
  
  if (duplicateNote) {
    console.log(chalk.red("Title taken! Change the title."));
  } else {
    notes.push({ title, body });
    saveNotes(notes);
    console.log(chalk.green("Note added"));
  }
};

const removeNote = (title) => {
  const notes = loadNotes();
  const filteredNotes = notes.filter((note) => note.title !== title);
  if (notes.length > filteredNotes.length) {
    saveNotes(filteredNotes);
    console.log(chalk.green("Note removed."));
  } else {
    console.log(chalk.red("Note not found."));
  }
};

const listNotes = () => {
  const notes = loadNotes();
  console.log(chalk.blue("Your notes:"));
  notes.forEach((note) => console.log(note.title));
};

const readNote = (title) => {
  const notes = loadNotes();
  const note = notes.find((note) => note.title === title);
  if (note) {
    console.log(chalk.blue(note.title));
    console.log(note.body);
  } else {
    console.log(chalk.red("Not found"));
  }
};

module.exports = {
  addNote,
  removeNote,
  listNotes,
  readNote,
};
