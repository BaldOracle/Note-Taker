const util = require('util');
const fs = require('fs');
const uuid = require('../helper/uuid');
const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);

class Note {
  //reads db.json file where the notes are stored 
  async read() {
    return readFileAsync('db/db.json', 'utf8');
  }

  async write(note) {
    return writeFileAsync('db/db.json', JSON.stringify(note));
  }

  async getNotes() {
    try {
      const notes = await this.read();
      return [].concat(JSON.parse(notes));
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  async addNote(note) {
    const { title, text } = note;

    if (!title || !text) {
      throw new Error("Must have title and notes to save!");
    }

    const newNote = { title, text, id: uuid() };

    const notes = await this.getNotes();
    const updatedNotes = [...notes, newNote];
    await this.write(updatedNotes);

    return newNote;
  }

  async removeNote(id) {
    const notes = await this.getNotes();
    const filteredNotes = notes.filter((note) => note.id !== id);

    if (filteredNotes.length === notes.length) {
      throw new Error("Note not found");
    }

    await this.write(filteredNotes);
  }
}
  

module.exports = new Note();

