import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HDocsectionComponent } from './components/h-docsection/h-docsection.component';

const routes: Routes = [
  {
    path: '',
    component: HDocsectionComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
