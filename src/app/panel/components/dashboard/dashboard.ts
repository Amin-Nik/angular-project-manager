import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Column, Task } from '../../../models/Task-model';
import { colsData } from '../../../data/mockData';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

type ColumnsTitle = Omit<Column, 'tasks'>;
type TaskFormData = Omit<Task, 'id'>;

@Component({
  selector: 'app-dashboard',
  standalone: false,
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  fb = inject(FormBuilder);
  isEditMode = signal(false);
  isAddColModalOpen = signal(false);
  isAddTaskModalOpen = signal(false);
  isEditTaskModalOpen = signal(false);
  isAreYouSureModalOpen = signal(false);
  addNewColumnInput = signal('');
  editTaskData: Task | null = null;
  removeColId = signal<string>('');
  columns = signal<Column[]>(colsData);
  previousColumnsTitle: ColumnsTitle[] = [];

  theForm = this.fb.group({
    title: ['', [Validators.required]],
  });

  ngOnInit() {
    this.previousColumnsTitle = colsData.map(({ id, title }) => ({ id, title }));
  }

  onInput(title: string, id: string) {
    this.columns.update((current) =>
      current.map((column) => (column.id === id ? { ...column, title } : column)),
    );
  }

  onAccept() {
    this.previousColumnsTitle = this.columns().map(({ id, title }) => ({ id, title }));
    this.isEditMode.set(false);
  }

  onCancel() {
    this.columns.update((current) =>
      this.previousColumnsTitle.map(({ id, title }) => {
        const col = current.find((col) => col.id === id);

        return col ? { ...col, title } : { id, title, tasks: [] };
      }),
    );
    this.isEditMode.set(false);
  }

  onRemoveCol(id: string) {
    const removeColIndex = this.columns().findIndex((col) => col.id === id);
    if (this.columns()[removeColIndex].tasks.length === 0) {
      const tempCol = [...this.columns()];
      tempCol.splice(removeColIndex, 1);
      this.columns.set(tempCol);
    } else {
      alert("you can't delete columns with task cards");
    }
    this.isAreYouSureModalOpen.set(false);
  }

  addColumn() {
    this.columns.update((current) => [
      ...current,
      { id: crypto.randomUUID(), title: this.theForm.value.title!, tasks: [] },
    ]);
    this.isAddColModalOpen.set(false);
    this.theForm.reset();
  }

  addTask(task: TaskFormData) {
    const newTask = { id: crypto.randomUUID(), ...task };
    this.columns.update(([firstCol, ...restCol]) => [
      {
        ...firstCol,
        tasks: [newTask, ...firstCol.tasks],
      },
      ...restCol,
    ]);
    this.isAddTaskModalOpen.set(false);
  }

  openEditTaskModal(colId: string, taskId: string) {
    const col = this.columns().find((col) => col.id === colId);
    this.editTaskData = col?.tasks.find((task) => task.id === taskId) ?? null;
    this.isEditTaskModalOpen.set(true);
  }
  editTask(editedTask: TaskFormData) {
    const taskId = this.editTaskData?.id;
    if (taskId) {
      this.columns.update((current) =>
        current.map((col) => {
          const tasks = col.tasks.map((task) =>
            task.id === taskId ? (task = { id: task.id, ...editedTask }) : task,
          );
          if (tasks) {
            return { ...col, tasks };
          }
          return col;
        }),
      );
      this.isEditTaskModalOpen.set(false);
    }
  }

  deleteTask() {
    const taskId = this.editTaskData?.id;
    if (taskId) {
      this.columns.update((current) =>
        current.map((col) => {
          const tasks = col.tasks.filter((task) => task.id !== taskId);
          if (tasks) {
            return { ...col, tasks };
          }
          return col;
        }),
      );
      this.isEditTaskModalOpen.set(false);
      this.isAreYouSureModalOpen.set(false);
    }
  }

  DeleteModal() {
    if (this.isEditMode()) {
      this.onRemoveCol(this.removeColId());
    } else if (this.isEditTaskModalOpen()) {
      this.deleteTask();
    }
  }

  dropTask(event: CdkDragDrop<Task[]>) {
    const currentContainer = event.previousContainer.data;
    const moveToContainer = event.container.data;
    const currentIndex = event.previousIndex;
    const moveToIndex = event.currentIndex;
    if (currentContainer === moveToContainer) {
      moveItemInArray(currentContainer, currentIndex, moveToIndex);
    } else {
      transferArrayItem(currentContainer, moveToContainer, currentIndex, moveToIndex);
    }
    this.columns.update((columns) => [...columns]);
  }

  dropCol(event: CdkDragDrop<Column[]>) {
    const currentContainer = event.previousContainer.data;
    const moveToContainer = event.container.data;
    const currentIndex = event.previousIndex;
    const moveToIndex = event.currentIndex;
    moveItemInArray(currentContainer, currentIndex, moveToIndex);
    this.columns.update((columns) => [...columns]);
  }
}
