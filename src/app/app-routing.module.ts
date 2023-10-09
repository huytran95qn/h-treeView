import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HTreeViewSampleComponent } from './components/h-treeViewSample/h-treeViewSample.component';

const routes: Routes = [
  {
    path: '',
    component: HTreeViewSampleComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
