import { Component, OnInit } from '@angular/core';
import { Task } from './task';
import { FirebaseService } from './services/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  tasks: Task[] = [];
  newTask: string = '';
  newDescription: string = '';

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.fetchTasks();
  }

  fetchTasks() {
    this.firebaseService.fetchTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
      },
      error: (error) => {
        console.error('Error fetching tasks:', error);
      }
    });
  }

  addTask(): void {
    this.firebaseService.addTask(this.newTask, this.newDescription)
      .then(() => {
        // Clear input fields after adding task
        this.newTask = '';
        this.newDescription = '';
      })
      .catch(error => console.error('Error adding task:', error));
      this.fetchTasks();
  }

  deleteTask(taskName: string): void {
    this.firebaseService.deleteTask(taskName)
      .then(() => {
        // Task deleted successfully, update tasks list
        this.tasks = this.tasks.filter(task => task.task !== taskName);
      })
      .catch(error => console.error('Error deleting task:', error));
  }
}
