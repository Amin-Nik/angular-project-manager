import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { PanelRoutingModule } from './panel-routing-module';
import { Form } from './components/form/form';
import { ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [Login, Dashboard, Form],
  imports: [CommonModule, PanelRoutingModule, ReactiveFormsModule, DragDropModule],
})
export class PanelModule {}
