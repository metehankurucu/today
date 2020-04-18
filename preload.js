// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { ipcMain, ipcRenderer} = require('electron');
const moment = require('moment');

window.addEventListener('DOMContentLoaded', () => {

  //Functions
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  function alert(text,type){
    const alert = document.getElementById('alert');
    alert.innerHTML = 
      '<div class="alert alert-' + type + ' alert-dismissible fade show" role="alert">' + 
        '<strong>' + text + '</strong>' +
         ' <button type="button" class="close" data-dismiss="alert" aria-label="Close"> ' +
         ' <span aria-hidden="true">&times;</span> ' +
        '</button>' +
      '</div>'
  }

  function appendTodo(parentId,text,done = false){
    const li = document.createElement('li');

    const div = document.createElement('div');
    div.className = 'form-check'

    const label = document.createElement('label');
    label.className = 'form-check-label';

    const input = document.createElement('input');
    input.className = 'checkbox';
    input.type = 'checkbox';

    if(done){
      input.checked = 'true';
      input.disabled = 'true';
    }else{
      input.onclick = () => addDone(li,text);
    }

    const iInput = document.createElement('i');
    iInput.className = 'input-helper';
   
    label.appendChild(input);
    label.append(text);
    label.appendChild(iInput);

    div.appendChild(label);

    li.appendChild(div);

    if(!done){
      const iRemove = document.createElement('i');
      iRemove.className = 'remove mdi mdi-close-circle-outline';
      iRemove.onclick = () => removeTodo(li,text);
      li.appendChild(iRemove);
    }

    const parent = document.getElementById(parentId);

    parent.appendChild(li);
  }
  

  //Main

  ipcRenderer.on('initialize', (error,today) => {
    replaceText("today",today.date);
    today.todos.forEach(todo => {
      appendTodo('todos',todo,false);
    });
    today.done.forEach(todo => {
      appendTodo('done',todo,true);
    });
  })

  const addBtn = document.getElementById('addBtn');
  addBtn.addEventListener('click',() => {
    const todo = document.getElementById('todo').value
    if(todo !== ''){
      ipcRenderer.send('addTodo',todo);
      appendTodo('todos',todo,false);
    }else{
      alert('Plase enter a todo','light')
    }
  })


  function removeTodo(element,todo){
    ipcRenderer.send('deleteTodo',todo);
    const todos = document.getElementById('todos');
    todos.removeChild(element);
  }

  function addDone(element,todo){
    ipcRenderer.send('addDone',todo);
    const todos = document.getElementById('todos');
    todos.removeChild(element);
    appendTodo('done',todo,true);
  }
  
});
