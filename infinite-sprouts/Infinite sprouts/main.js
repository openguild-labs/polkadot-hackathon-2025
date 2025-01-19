// Dropdown Logic
document.addEventListener("click", function (event) {
    const allDropdowns = document.querySelectorAll(".dropdown-content");
    const activeContainer = event.target.closest(".icon-container");

    // Close all dropdowns
    allDropdowns.forEach((dropdown) => dropdown.style.display = "none");

    // If clicked on icon-container, toggle its dropdown
    if (activeContainer) {
        const dropdown = activeContainer.querySelector(".dropdown-content");
        dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    }
});

// Ensure dropdowns close on outside click
window.addEventListener("click", (e) => {
    if (!e.target.closest(".icon-container")) {
        document.querySelectorAll(".dropdown-content").forEach((dropdown) => {
            dropdown.style.display = "none";
        });
    }
});


// Get references to necessary elements
const notepadIcon = document.getElementById("notepadIcon");
const notepadDropdown = document.getElementById("notepadDropdown");
const closeButton = document.querySelector(".close-button");
const saveNoteBtn = document.getElementById("saveNoteBtn");
const editNoteBtn = document.getElementById("editNoteBtn");
const deleteNoteBtn = document.getElementById("deleteNoteBtn");
const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const noteTags = document.getElementById("noteTags");
const notesList = document.getElementById("notesList");
const searchNotes = document.getElementById("searchNotes");

let notes = [];

// Show or hide notepad dropdown
notepadIcon.addEventListener("click", () => {
    notepadDropdown.style.display = notepadDropdown.style.display === "block" ? "none" : "block";
});

// Close the notepad dropdown
closeButton.addEventListener("click", () => {
    notepadDropdown.style.display = "none";
});

// Save note
saveNoteBtn.addEventListener("click", () => {
    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();
    const tags = noteTags.value.trim().split(",").map(tag => tag.trim()).filter(tag => tag);

    if (title && content) {
        const note = { title, content, tags };
        notes.push(note);
        displayNotes();
        clearNoteForm();
    } else {
        alert("Please fill in both title and content.");
    }
});

// Edit note
editNoteBtn.addEventListener("click", () => {
    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();
    const tags = noteTags.value.trim().split(",").map(tag => tag.trim()).filter(tag => tag);

    if (title && content) {
        const noteIndex = notes.findIndex(note => note.title === title); // For simplicity, using title to find the note
        if (noteIndex !== -1) {
            notes[noteIndex] = { title, content, tags };
            displayNotes();
            clearNoteForm();
        }
    }
});

// Delete note
deleteNoteBtn.addEventListener("click", () => {
    const title = noteTitle.value.trim();

    if (title) {
        const noteIndex = notes.findIndex(note => note.title === title);
        if (noteIndex !== -1) {
            notes.splice(noteIndex, 1);
            displayNotes();
            clearNoteForm();
        }
    }
});

// Display notes in the list
function displayNotes() {
    notesList.innerHTML = "";

    notes.forEach((note, index) => {
        const noteItem = document.createElement("li");
        noteItem.textContent = `${note.title} - Tags: ${note.tags.join(", ")}`;
        noteItem.addEventListener("click", () => {
            noteTitle.value = note.title;
            noteContent.value = note.content;
            noteTags.value = note.tags.join(", ");
            editNoteBtn.style.display = "inline-block";
            deleteNoteBtn.style.display = "inline-block";
        });
        notesList.appendChild(noteItem);
    });
}
