document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("todo-form");
  const todoInput = document.getElementById("todo-input");
  const dateInput = document.getElementById("date-input");
  const noteInput = document.getElementById("note-input");
  const tableBody = document.getElementById("todo-tbody");
  const deleteAllBtn = document.getElementById("delete-all");
  const filterSelect = document.getElementById("filter-select");
  let currentFilter = "all";
    filterSelect.addEventListener("change", (e) => {
        currentFilter = e.target.value;
        renderTodos();
    });
  //to do akan disimpan dilocalstrorage
  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  //fungsi untuk menyimpan todos ke localstorage
  function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  function renderTodos() {
    tableBody.innerHTML = "";

    //filter sesuai dengan pilihan
    const filtered = todos.filter(todo => {
    if (currentFilter === "all") return true;
    if (currentFilter === "completed") return todo.completed;
    if (currentFilter === "pending") return !todo.completed;
  });

    if (filtered.length === 0) {
      const row = document.createElement("tr");
      row.innerHTML = `
       <td 
       colspan="4" class="text-center text-gray-400 py-4">No task found
       </td>`;
       tableBody.appendChild(row);
      return;
    }

    filtered.forEach(todo => {
    const index = todos.indexOf(todo); // ambil index dari array utama
    const row = document.createElement("tr");

      row.innerHTML = `
        <td class="border border-blue-500/20 px-4 py-2 text-center">
            <input type="checkbox" class="select-task" data-index="${index}">
        <td class="border border-blue-500/20 px-4 py-2 text-center">${todo.task}</td>
        <td class="border border-blue-500/20 px-4 py-2 text-center">${todo.dueDate || '-'}</td>
        <td class="border border-blue-500/20 px-4 py-2 text-center">
          <span class="px-2 py-1 rounded text-xs ${todo.completed ? 'bg-green-500 text-white' : 'bg-yellow-400 text-black'}">
            ${todo.completed ? 'Completed' : 'Pending'}
          </span>
        </td>
        <td class="border border-blue-500/20 px-4 py-2 text-center">
          <button class="text-white bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-sm toggle-btn" data-index="${index}">
            ${todo.completed ? 'Undo' : 'Done'}
          </button>
        </td>
        <td class="border border-blue-500/20 px-4 py-2 text-center">
          <button class="text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-sm note-btn" data-index="${index}">
            Lihat Catatan
          </button>
        </td>

      `;
      tableBody.appendChild(row);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const task = todoInput.value.trim();
    const dueDate = dateInput.value;

    if (!task) return;

    todos.push({
      task,
      dueDate,
      note: noteInput.value.trim(),
      completed: false
    });

    saveTodos(); // Simpan perubahan ke localStorage

    todoInput.value = "";
    dateInput.value = "";
    noteInput.value = "";
    renderTodos();
  });

  tableBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("toggle-btn")) {
      const index = e.target.dataset.index;
      todos[index].completed = !todos[index].completed;

        saveTodos(); // Simpan perubahan ke localStorage

      renderTodos();
    }

    if (e.target.classList.contains("note-btn")) {
      const index = e.target.dataset.index;
      const note = todos[index].note || "No note available.";
      alert(note);
    }
  });

    deleteAllBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all tasks?")) {
      todos = [];
      saveTodos(); // Simpan perubahan ke localStorage
      renderTodos();
    }
  });

  // Tambahan fitur Delete Selected
  const deleteSelectedBtn = document.getElementById("delete-selected");

  deleteSelectedBtn.addEventListener("click", () => {
    const selectedCheckboxes = document.querySelectorAll(".select-task:checked");
    if (selectedCheckboxes.length === 0) {
      alert("Please select at least one task to delete!");
      return;
    }

    if (confirm(`Are you sure you want to delete ${selectedCheckboxes.length} selected task(s)?`)) {
      const indicesToDelete = Array.from(selectedCheckboxes)
        .map(cb => parseInt(cb.dataset.index))
        .sort((a, b) => b - a);

      indicesToDelete.forEach(index => {
        todos.splice(index, 1);
      });

      saveTodos();
      renderTodos();
    }
  });

const noteModal = document.getElementById("note-modal");
const noteContent = document.getElementById("note-content");
const closeNoteBtn = document.getElementById("close-note-modal");

//buka modal catatan saat tombol catatan diklik
tableBody.addEventListener("click", (e) => {
  if (e.target.classList.contains("note-btn")) {
    const index = e.target.dataset.index;
    const note = todos[index].note || "No note available.";
    noteContent.textContent = note;
    noteModal.classList.remove("hidden");
    noteModal.classList.add("flex");
  }
});

//tutup modal catatan
closeNoteBtn.addEventListener("click", () => {
  noteModal.classList.add("hidden");
  noteModal.classList.remove("flex");
});

//tutup modal catatan saat klik di luar konten modal
noteModal.addEventListener("click", (e) => {
  if (e.target === noteModal) {
    noteModal.classList.add("hidden");
    noteModal.classList.remove("flex");
  }
});


  renderTodos();
});
