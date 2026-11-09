import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'panel/dashboard', pathMatch: 'full' },
  {
    path: 'landing',
    loadChildren: () => import('./landing/landing-module').then((m) => m.LandingModule),
  },
  {
    path: 'panel',
    loadChildren: () => import('./panel/panel-module').then((m) => m.PanelModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
