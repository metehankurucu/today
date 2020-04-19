const storage = require('electron-json-storage');
var moment = require('moment');

class Today {
    date;
    done = [];
    todos = [];

    constructor(){
        const today = moment().format("DD-MM-YYYY");
        this.date = today;
        
        const exist = this.storageHas(today)
        .then(() => {
            this.getFromStorage(today)
            .then(data => {
                this.done = data.done;
                this.todos = data.todos;
            });
        })
        .catch((err) => {
            console.log(err);
            this.todos = [];
            this.done = [];
        })
    }

    addDone = (todo) => {
        //Add todo to done
        this.done.push(todo);
        //Delete todo from todos
        this.deleteTodo(todo);
        return { done:this.done, todos:this.todos };
    }

    addTodo(todo){
        this.todos.push(todo);
        this.saveToday();
        return this.todos;
    }

    deleteTodo = (todo) => {
        //Find and delete todo from todos
        for(let i = 0;i < this.todos.length; i++){
            if(this.todos[i] === todo){
                this.todos.splice(i,1);
            }
        }
        this.saveToday();
        return todo;
    }

    deleteTodos = () => {
        this.todos = [];
        this.saveToday();
    }

    deleteDone = () => {
        this.done = [];
        this.saveToday();
    }

    saveToday = () => {
        const today = this.get();
        storage.set(today.date, today, function(error) {
            if (error) throw error;
            return true;
        });
    }

    storageHas = (date) => {
        return new Promise((resolve,reject) => {
            storage.has(date, function(error, hasKey) {
                if (hasKey) {
                    resolve(true);
                }
                reject();
            });
        })
    } 

    getFromStorage = async (date) => {
        return new Promise((resolve,reject) => {
            storage.get(date, function(error, data) {
                if (error){
                    reject(error);
                } 
                console.log(data);
                resolve(data);
            });
        });
    }

    get = () => {
        return { date:this.date, todos:this.todos, done:this.done };
    }

}

module.exports = Today;
