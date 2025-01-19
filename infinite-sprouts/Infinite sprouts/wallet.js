    // Function to toggle visibility of the action sections
    function toggleSection(sectionId) {
        // Hide all sections first
        const sections = document.querySelectorAll('.action-section');
        sections.forEach(section => {
            section.classList.remove('active');
        });
    
        // Show the clicked section
        const sectionToShow = document.getElementById(sectionId);
        sectionToShow.classList.add('active');
    }
    
    // Function to close the section when the back arrow is clicked
    function closeSection(sectionId) {
        const sectionToClose = document.getElementById(sectionId);
        sectionToClose.classList.remove('active');
    }
    

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

// Search notes
searchNotes.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm) ||
        note.content.toLowerCase().includes(searchTerm)
    );
    displayFilteredNotes(filteredNotes);
});

// Display filtered notes
function displayFilteredNotes(filteredNotes) {
    notesList.innerHTML = "";

    filteredNotes.forEach(note => {
        const noteItem = document.createElement("li");
        noteItem.textContent = `${note.title} - Tags: ${note.tags.join(", ")}`;
        notesList.appendChild(noteItem);
    });
}

// Clear note form
function clearNoteForm() {
    noteTitle.value = "";
    noteContent.value = "";
    noteTags.value = "";
    editNoteBtn.style.display = "none";
    deleteNoteBtn.style.display = "none";
}

// Save notes to local storage (optional)
window.addEventListener("beforeunload", () => {
    localStorage.setItem("notes", JSON.stringify(notes));
});

// Load notes from local storage (optional)
window.addEventListener("load", () => {
    const storedNotes = JSON.parse(localStorage.getItem("notes"));
    if (storedNotes) {
        notes = storedNotes;
        displayNotes();
    }
});

// Function to switch between main sections
function showSection(sectionId) {
    // Deactivate all buttons
    document.querySelectorAll(".header-button").forEach(button => {
        button.classList.remove("active");
    });

    // Activate clicked button
    document.getElementById(`btn${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}`).classList.add("active");

    // Hide all sections
    document.querySelectorAll(".center_content.section").forEach(section => {
        section.classList.remove("active");
    });

    // Show selected section
    document.getElementById(sectionId).classList.add("active");
}

// Function to filter history
function filterHistory(filterType) {
    // Deactivate all sub-buttons
    document.querySelectorAll(".history-sub-button").forEach(button => {
        button.classList.remove("active");
    });

    // Activate clicked sub-button
    document.querySelector(`[onclick="filterHistory('${filterType}')"]`).classList.add("active");

    // Update history content
    const historyContent = document.getElementById("historyContent");
    historyContent.innerHTML = `<p>Displaying ${filterType} history...</p>`;
}


function filterHistory(filter) {
    // Deactivate all history filter buttons
    document.querySelectorAll(".history-sub-button").forEach(button => {
        button.classList.remove("active");
    });

    // Activate the clicked button
    document.querySelector(`.history-sub-button[onclick="filterHistory('${filter}')"]`).classList.add("active");

    // Hide all history rows
    document.querySelectorAll(".history-row").forEach(row => {
        row.classList.remove("active");
        row.classList.add("hidden");
    });

    // Show relevant rows for the selected filter
    if (filter === 'all') {
        document.querySelectorAll(`.history-row[data-type]`).forEach(row => {
            row.classList.remove("hidden");
            row.classList.add("active");
        });
    } else {
        document.querySelectorAll(`.history-row[data-type="${filter}"]`).forEach(row => {
            row.classList.remove("hidden");
            row.classList.add("active");
        });
    }

    // Show placeholder if no rows are visible
    const visibleRows = document.querySelectorAll(".history-row.active");
    const placeholderRow = document.querySelector(".placeholder-row");
    if (visibleRows.length === 0) {
        placeholderRow.classList.remove("hidden");
    } else {
        placeholderRow.classList.add("hidden");
    }
}

// Ensure the "ALL" filter is shown by default on page load
document.addEventListener("DOMContentLoaded", () => {
    filterHistory('all');
});

function toggleRecommendations(show) {
    const recommendations = document.getElementById('recommendations');
    if (show) {
        recommendations.classList.remove('hidden');
    } else {
        recommendations.classList.add('hidden');
    }
}


// Get references to elements
const actionSection = document.querySelector('.action-section');
const parentDiv = document.querySelector('.content-sections'); // Replace with actual parent div selector

// Function to show the action section
function showActionSection() {
    actionSection.style.display = 'block';
    actionSection.style.opacity = '1'; // Smooth fade-in
    parentDiv.classList.add('no-scroll'); // Disable scrolling on parent
}

// Function to hide the action section
function hideActionSection() {
    actionSection.style.display = 'none';
    actionSection.style.opacity = '0'; // Smooth fade-out
    parentDiv.classList.remove('no-scroll'); // Re-enable scrolling on parent
}

// Example: Toggle action section (call these functions as needed)
document.getElementById('showButton').addEventListener('click', showActionSection);
document.getElementById('hideButton').addEventListener('click', hideActionSection);
