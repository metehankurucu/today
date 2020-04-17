// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const electron = require('electron');
const moment = require('moment');

window.addEventListener('DOMContentLoaded', () => {

  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  replaceText("today",moment().format("DD/MM/YYYY"));


  const addBtn = document.getElementById('addBtn');
  addBtn.addEventListener('click',() => {
    const todo = document.getElementById('todo').value
    if(todo !== ''){
      electron.ipcRenderer.send('onAddTodo',todo);
    }else{
      alert('Plase enter a todo','light')
    }
  })



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
})
