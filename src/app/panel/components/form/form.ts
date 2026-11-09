import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Task } from '../../../models/Task-model';

type TaskFormData = Omit<Task, 'id'>;

@Component({
  selector: 'app-form',
  standalone: false,
  styleUrl: './form.css',
  templateUrl: './form.html',
})
export class Form {
  closeModal = output<boolean>();
  formData = output<TaskFormData>();
  deleteTask = output();
  editModeData = input<Task | null>(null);
  isEditMode = signal(false);
  fb = inject(FormBuilder);
  assignToOptions = ['Amin', 'Sara', 'Ali', 'Reza', 'Nima'];
  priorityOptions = ['Low', 'Medium', 'High', 'Urgent'];

  theForm = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    assignTo: ['', [Validators.required]],
    priority: ['', [Validators.required]],
    label: ['', [Validators.required]],
    duration: ['', [Validators.required]],
  });

  constructor() {
    effect(() => {
      const data = this.editModeData();
      if (data) {
        this.isEditMode.set(true);
        this.theForm.patchValue(data);
      }
    });
  }

  onSubmit() {
    this.formData.emit(this.theForm.getRawValue());
    this.theForm.reset();
  }
  onCloseModal() {
    this.closeModal.emit(false);
  }
  onDeleteTask() {
    this.deleteTask.emit();
  }
}
