import { Component, OnInit } from '@angular/core';
import {Todo} from './todo';
import {TodoService} from './todo.service';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

  todos: Todo[] = [];
  activeTasks: number = 0;
  path: string = 'all';
  username: string = '';

  constructor(
    private todoService: TodoService, 
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.username = localStorage.getItem('username');
  }

  logout() {
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.path = params['status'];
      this.getTodos(this.path);
    });
  }

  onAddTodo(todo: Todo) {
    this.todoService.addTodo(todo)
    .then(result => {
      if (Object.keys(result).length !== 0){
        this.todos.push(result);
        this.filterStatus(this.path);
        this.calculateActiveTasks();
      }
    });
  }

  onToggleTodoComplete(todo: Todo) {
    this.todoService.toggleTodoComplete(todo)
    .then(result => {
      this.filterStatus(this.path);
      this.calculateActiveTasks()
    });
  }

  onRemoveTodo(todo: Todo) {
    this.todoService.deleteTodoById(todo.id)
    .then(result => {
      if (Object.keys(result).length === 0){
        this.todos = this.todos.filter(item => item.id !== todo.id);
        this.filterStatus(this.path);
        this.calculateActiveTasks();
      }
    });
  }

  getTodos(filter = 'all') {
    this.todoService.getAllTodos()
    .then(todos => {
      this.todos = todos.map(todo => todo);
      this.filterStatus(filter);
      this.calculateActiveTasks();
    });
  }

  calculateActiveTasks() {
      this.activeTasks = this.todos.filter(todo => !todo.complete).length;
  }

  filterStatus(filter) {
    switch(filter) {
        case 'active': {
          this.todos = this.todos
            .filter(todo => !todo.complete);
          break;
        }
        case 'completed': {
          this.todos = this.todos
            .filter(todo => todo.complete);
          break;
        }
        default: {
          break;
        }
    }
  }

  clearCompleted() {
    this.todos = this.todos.filter(todo => !todo.complete);
    this.todoService.deleteCompleted().then(result => {
      if (Object.keys(result).length === 0){
        this.filterStatus(this.path);
        this.calculateActiveTasks();
        this.router.navigate(['/all']);
      }
    });
  }

}
