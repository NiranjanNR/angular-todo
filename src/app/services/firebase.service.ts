
import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, query, collection, getDocs, addDoc, where, deleteDoc, doc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { Task } from '../task';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  tasks: Task[] = [];
  db: any;

  constructor() {
    const firebaseConfig = {
      apiKey: "AIzaSyCEDzBKuPgd4bTgpZftuyliCtCoTt3c89g",
      authDomain: "angular-todo-5fedf.firebaseapp.com",
      projectId: "angular-todo-5fedf",
      storageBucket: "angular-todo-5fedf.appspot.com",
      messagingSenderId: "983223714955",
      appId: "1:983223714955:web:2fce0549ec197b20b6408e"
    };
    
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
  }

  fetchTasks(): Observable<Task[]> {
    const taskQuery = query(collection(this.db, 'tasks'));
    return new Observable<Task[]>(observer => {
      getDocs(taskQuery)
        .then(querySnapshot => {
          const tasks: Task[] = [];
          querySnapshot.forEach(doc => {
            const taskData = doc.data() as Task;
            tasks.push({
              task: taskData.task,
              description: taskData.description
            });
          });
          observer.next(tasks);
        })
        .catch(error => observer.error(error));
    });
  }

  addTask(newTask: string, newDescription: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (newTask.trim() !== '' && newDescription.trim() !== '') {
        const task: Task = { task: newTask, description: newDescription };
        addDoc(collection(this.db, 'tasks'), task)
          .then(() => resolve())
          .catch(error => reject(error));
      } else {
        reject('Task name and description cannot be empty');
      }
    });
  }

  deleteTask(taskName: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const q = query(collection(this.db, 'tasks'), where('task', '==', taskName));
      getDocs(q)
        .then(querySnapshot => {
          if (querySnapshot.empty) {
            reject(`No task found with the name: ${taskName}`);
            return;
          }
          querySnapshot.forEach((docu) => {
            deleteDoc(doc(this.db, `tasks/${docu.id}`))
              .then(() => resolve())
              .catch(error => reject(error));
          });
        })
        .catch(error => reject(error));
    });
  }
}
