const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    const noteInput = document.getElementById('noteInput');
    const addNoteButton = document.getElementById('addNote');
    const notesBoard = document.getElementById('notesBoard');

    let notes = [];
    let isEditing = false;
    let currentEditingIndex = null;

    async function loadNotes() {
        notes = await ipcRenderer.invoke('load-notes');
        renderNotes();
    }

    function renderNotes() {
        notesBoard.innerHTML = '';
        notes.forEach((note, index) => {
            const noteElement = document.createElement('div');
            noteElement.className = 'note';
            noteElement.innerHTML = note;
            const editContainer = document.createElement('div');
            editContainer.className = 'edit-container';

            const editButton = document.createElement('button');
            editButton.textContent = '✎';
            editButton.className = 'edit-button';
            editButton.addEventListener('click', (e) => {
                e.stopPropagation();
                editNote(index);
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = '×';
            deleteButton.className = 'delete';
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteNote(index);
            });

            editContainer.appendChild(editButton);
            editContainer.appendChild(deleteButton);
            noteElement.appendChild(editContainer);
            notesBoard.appendChild(noteElement);
        });
    }

    function addNote() {
        const note = noteInput.value.trim();
        if (note) {
            if (isEditing) {
                notes[currentEditingIndex] = note;
                isEditing = false;
                currentEditingIndex = null;
            } else {
                notes.push(note);
            }
            noteInput.value = '';
            saveNotes();
            renderNotes();
        }
    }

    function deleteNote(index) {
        notes.splice(index, 1);
        saveNotes();
        renderNotes();
    }

    function editNote(index) {
        isEditing = true;
        currentEditingIndex = index;
        noteInput.value = notes[index];
    }

    async function saveNotes() {
        await ipcRenderer.invoke('save-notes', notes);
    }

    addNoteButton.addEventListener('click', addNote);
    loadNotes();
});
