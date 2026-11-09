import { Component, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Column, Task } from '../../../models/Task-model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BoardService } from '../../../services/board';

type ColumnsTitle = Omit<Column, 'tasks'>;
type TaskFormData = Omit<Task, 'id'>;

@Component({
  selector: 'app-dashboard',
  standalone: false,
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit, OnDestroy {
  fb = inject(FormBuilder);
  boardService = inject(BoardService);
  isEditMode = signal(false);
  isAddColModalOpen = signal(false);
  isAddTaskModalOpen = signal(false);
  isEditTaskModalOpen = signal(false);
  isAreYouSureModalOpen = signal(false);
  addNewColumnInput = signal('');
  editTaskData: Task | null = null;
  removeColId = signal<string>('');
  columns = signal<Column[]>([]);
  previousColumnsTitle: ColumnsTitle[] = [];

  private unsubscribe?: () => void;

  theForm = this.fb.group({
    title: ['', [Validators.required]],
  });

  getRandomId(): string {
    const bytes = crypto.getRandomValues(new Uint8Array(16));

    bytes[6] = (bytes[6] & 0x0f) | 0x40;

    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0'));

    return [
      hex.slice(0, 4).join(''),
      hex.slice(4, 6).join(''),
      hex.slice(6, 8).join(''),
      hex.slice(8, 10).join(''),
      hex.slice(10, 16).join(''),
    ].join('-');
  }

  ngOnInit() {
    this.unsubscribe = this.boardService.listenToColumns((columns) => {
      this.columns.set(columns);
    });
  }

  onInput(title: string, id: string) {
    this.columns.update((current) =>
      current.map((column) => (column.id === id ? { ...column, title } : column)),
    );
  }

  onAccept() {
    this.previousColumnsTitle = this.columns().map(({ id, title }) => ({ id, title }));
    this.isEditMode.set(false);
    this.saveToFirebase();
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
      this.saveToFirebase();
    } else {
      alert("you can't delete columns with task cards");
    }
    this.isAreYouSureModalOpen.set(false);
  }

  addColumn() {
    const random = this.getRandomId();
    this.columns.update((current) => [
      ...current,
      { id: random, title: this.theForm.value.title!, tasks: [] },
    ]);
    this.isAddColModalOpen.set(false);
    this.theForm.reset();
    this.saveToFirebase();
  }

  addTask(task: TaskFormData) {
    const random = this.getRandomId();
    const newTask = { id: random, ...task };
    this.columns.update(([firstCol, ...restCol]) => [
      {
        ...firstCol,
        tasks: [newTask, ...firstCol.tasks],
      },
      ...restCol,
    ]);
    this.isAddTaskModalOpen.set(false);
    this.saveToFirebase();
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
      this.saveToFirebase();
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
      this.saveToFirebase();
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
    this.saveToFirebase();
  }

  dropCol(event: CdkDragDrop<Column[]>) {
    const currentContainer = event.previousContainer.data;
    const moveToContainer = event.container.data;
    const currentIndex = event.previousIndex;
    const moveToIndex = event.currentIndex;
    moveItemInArray(currentContainer, currentIndex, moveToIndex);
    this.columns.update((columns) => [...columns]);
    this.saveToFirebase();
  }

  ngOnDestroy() {
    this.unsubscribe?.();
  }

  saveToFirebase() {
    this.boardService.saveColumns(this.columns()).catch((error) => {
      console.error('Firebase save error:', error);
    });
  }
}
