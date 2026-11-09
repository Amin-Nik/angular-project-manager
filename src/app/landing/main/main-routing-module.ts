import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Index } from './components/index';
import { About } from './components/about/about';
import { Blog } from './components/blog/blog';
import { Contact } from './components/contact/contact';

const routes: Routes = [
  { path: '', component: Index },
  { path: 'about', component: About },
  { path: 'blog', component: Blog },
  { path: 'contact', component: Contact },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
