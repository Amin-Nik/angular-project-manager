import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Index } from './components/index/index';
import { About } from './components/about/about';
import { Contact } from './components/contact/contact';
import { Blog } from './components/blog/blog';
import { MainRoutingModule } from './main-routing-module';

@NgModule({
  declarations: [Index, About, Contact, Blog],
  imports: [CommonModule, MainRoutingModule],
})
export class MainModule {}
