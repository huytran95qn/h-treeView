import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { BasicDocsComponent } from './basic-doc/basic-doc.component';
import { TemplateDocComponent } from './template-doc/template-doc.component';
import { SharedModule } from '../shared/shared.module';
import { HTreeViewModule } from 'projects/h-tree-view/src/public-api';
import { HTreeViewSampleService } from '../services/h-treeViewSample.service';
import { PagesRoutingModule } from './pages-routing.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

const ANGULAR_MARTERIALS = [
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatListModule
];

const PAGES = [
  PagesComponent,
  BasicDocsComponent,
  TemplateDocComponent
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    HTreeViewModule,
    PagesRoutingModule,
    ...ANGULAR_MARTERIALS
  ],
  declarations: PAGES,
  providers: [HTreeViewSampleService]
})
export class PagesModule { }
