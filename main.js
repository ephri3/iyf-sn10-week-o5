let tasks = [];
let currentFilter = 'all';

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const stored = localStorage.getItem('tasks');
  if (stored) {
    tasks = JSON.parse(stored);
  }
}

const taskInput    = document.getElementById('task-input');
const addBtn       = document.getElementById('add-btn');
const taskList     = document.getElementById('task-list');
const clearBtn     = document.getElementById('clear-btn');
const tabBtns      = document.querySelectorAll('.tab-btn');
const totalCount   = document.getElementById('total-count');
const activeCount  = document.getElementById('active-count');
const completedCount = document.getElementById('completed-count');

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  const task = {
    id: Date.now(),
    text,
    completed: false
  };

  tasks.push(task);
  saveTasks(); // ✅ Save

  taskInput.value = '';
  renderTasks();
  updateStats();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks(); // ✅ Save

  renderTasks();
  updateStats();
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) task.completed = !task.completed;

  saveTasks(); // ✅ Save

  renderTasks();
  updateStats();
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
  saveTasks(); // ✅ Save

  renderTasks();
  updateStats();
}

function renderTasks() {
  taskList.innerHTML = '';

  const filtered = tasks.filter(task => {
    if (currentFilter === 'active')    return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  if (filtered.length === 0) {
    return;
  }

  filtered.forEach(task => {
    const li = document.createElement('li');
    li.classList.add('task-item');
    if (task.completed) li.classList.add('completed');
    li.dataset.id = task.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(task.id));

    const span = document.createElement('span');
    span.classList.add('task-text');
    span.textContent = task.text;

    const delBtn = document.createElement('button');
    delBtn.classList.add('delete-btn');
    delBtn.innerHTML = '&times;';
    delBtn.title = 'Delete task';
    delBtn.addEventListener('click', () => deleteTask(task.id));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}

function updateStats() {
  const total     = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const active    = total - completed;

  totalCount.textContent     = total;
  activeCount.textContent    = active;
  completedCount.textContent = completed;
}

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

clearBtn.addEventListener('click', clearCompleted);

loadTasks();     // ✅ Load saved tasks
renderTasks();
updateStats();
