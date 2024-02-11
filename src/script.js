const todos = [];
const RENDER_EVENT = 'render-todo';
const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'TODO_APPS';

function generateId() {
  return +new Date();
}

function generateTodoObject(id, task, timestamp, isCompleted) {
  return {
    id,
    task,
    timestamp,
    isCompleted
  };
}

function findTodoIndex(todoId) {
  return todos.findIndex(todo => todo.id === todoId);
}

function isStorageExist() {
  return typeof Storage !== 'undefined';
}

function saveData() {
  if (isStorageExist()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  const data = JSON.parse(serializedData);

  if (data !== null) {
    todos.push(...data);
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}


function makeTodoItem(todoObject) {
    const { id, task, timestamp, isCompleted } = todoObject;
  
    const container = document.createElement('div');
    container.classList.add('item', 'mb-4', 'flex', 'justify-between', 'items-center', 'rounded-lg', 'py-3', 'px-3', 'shadow-md', 'rounded-lg');
  
    const textContainer = document.createElement('div');
    textContainer.classList.add('flex', 'flex-col', 'mr-3');
  
    const textTitle = document.createElement('h2');
    textTitle.classList.add('text-md', 'font-semibold', 'mb-2', 'overflow-hidden');
    textTitle.style.overflowWrap = 'break-word'; // Add overflow-wrap to ensure text does not overflow container
    textTitle.style.wordBreak = 'break-word'; // Add word-break to allow long words to break and wrap
    textTitle.innerText = task;
  
    const textTimestamp = document.createElement('p');
    textTimestamp.classList.add('text-sm',  'overflow-hidden');
    textTimestamp.style.overflowWrap = 'break-word'; // Add overflow-wrap to ensure text does not overflow container
    textTimestamp.style.wordBreak = 'break-word'; // Add word-break to allow long words to break and wrap
    textTimestamp.innerText = timestamp;
  
    textContainer.appendChild(textTitle);
    textContainer.appendChild(textTimestamp);

   

  
    const actionButtonContainer = document.createElement('div');
    actionButtonContainer.classList.add('flex', 'items-center');
  
    const actionButton = document.createElement('button');
    actionButton.classList.add('action-button', 'px-3', 'py-1', 'rounded-md', 'text-white');
    if (isCompleted) {
      // Menggunakan ikon SVG untuk Undo
      actionButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="m9 9 6-6m0 0 6 6m-6-6v12a6 6 0 0 1-12 0v-3" /></svg>';

      actionButton.classList.add('bg-yellow-500');  
    } else {
      // Menggunakan ikon SVG untuk Complete
      actionButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>';

      actionButton.classList.add('bg-green-500');
    }
    actionButton.addEventListener('click', () => {
      toggleTaskStatus(id);
    });
  
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button', 'ml-2', 'px-3', 'py-1', 'rounded-md', 'text-white', 'bg-red-500');
    // Menggunakan ikon SVG untuk Delete
    deleteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>';
    deleteButton.addEventListener('click', () => {
      deleteTask(id);
    });
  
    actionButtonContainer.appendChild(actionButton);
    actionButtonContainer.appendChild(deleteButton);
  
    container.appendChild(textContainer);
    container.appendChild(actionButtonContainer);
  
    return container;
}


  

function toggleTaskStatus(todoId) {
  const index = findTodoIndex(todoId);
  if (index !== -1) {
    todos[index].isCompleted = !todos[index].isCompleted;
    saveData();
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
}

function deleteTask(todoId) {
  const index = findTodoIndex(todoId);
  if (index !== -1) {
    todos.splice(index, 1);
    saveData();
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    addTodo();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log('Data berhasil disimpan.');
});

document.addEventListener(RENDER_EVENT, () => {
  const uncompletedList = document.getElementById('todos');
  const completedList = document.getElementById('completed-todos');

  uncompletedList.innerHTML = '';
  completedList.innerHTML = '';

  todos.forEach(todo => {
    const todoItem = makeTodoItem(todo);
    if (todo.isCompleted) {
      completedList.appendChild(todoItem);
    } else {
      uncompletedList.appendChild(todoItem);
    }
  });
});

function addTodo() {
    const titleInput = document.getElementById('title').value;
    const dateInput = document.getElementById('date').value;
  
    if (!titleInput || !dateInput) {
      alert('Please fill in both task title and date.');
      return;
    }
  
    const todoObject = generateTodoObject(generateId(), titleInput, dateInput, false);
    todos.push(todoObject);
  
    saveData();
    document.dispatchEvent(new Event(RENDER_EVENT));
  
    document.getElementById('title').value = '';
    document.getElementById('date').value = '';
  };
