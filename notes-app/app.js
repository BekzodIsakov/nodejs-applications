const yargs = require("yargs");
const notes = require("./notes");

yargs.command({
  command: "add",
  description: "Add a new note",

  builder: {
    title: {
      describe: "Description for title",
      demandOption: true,
      type: "string",
    },
    body: {
      describe: "Description for body",
      demandOption: true,
      type: "string",
    },
  },
  handler: function ({title, body}) {
    notes.addNote(title, body);
  },
});

yargs.command({
  command: "remove",
  description: "Remove a note",
  builder: {
    title: {
      describe: "Remove description",
      demandOption: true,
      type: "string",
    },
  },
  handler: function ({ title }) {
    notes.removeNote(title);
  },
});

yargs.command({
  command: "list",
  description: "Show all notes",
  handler: function () {
    notes.listNotes();
  },
});

yargs.command({
  command: "read",
  description: "Read a note",
  builder: {
    title: {
      describe: "Read description",
      demandOption: true,
      type: "string",
    },
  },
  handler: function ({ title }) {
    notes.readNote(title);
  },
});

yargs.parse();
// console.log(yargs.argv);
