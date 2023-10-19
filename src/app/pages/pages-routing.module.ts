import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BasicDocsComponent } from './basic-doc/basic-doc.component';
import { TemplateDocComponent } from './template-doc/template-doc.component';
import { PagesComponent } from './pages.component';
import { DragDropDocComponent } from './drag-drop-doc/drag-drop-doc.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'basic',
        component: BasicDocsComponent
      },
      {
        path: 'template',
        component: TemplateDocComponent
      },
      {
        path: 'dragDrop',
        component: DragDropDocComponent
      },
      {
        path: '**',
        redirectTo: 'basic'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
