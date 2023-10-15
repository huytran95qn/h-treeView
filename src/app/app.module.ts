import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BasicDocsComponent } from './components/basic-doc/basic-doc.component';
import { HDocsectionComponent } from './components/h-docsection/h-docsection.component';
import { HTreeViewSampleService } from './services/h-treeViewSample.service';
import { HTreeViewModule } from 'projects/h-tree-view/src/public-api';
import { SharedModule } from './shared/shared.module';
import { TemplateDocComponent } from './components/template-doc/template-doc.component';

@NgModule({
  declarations: [
    AppComponent,
    BasicDocsComponent,
    HDocsectionComponent,
    TemplateDocComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HTreeViewModule,
    SharedModule
  ],
  providers: [HTreeViewSampleService],
  bootstrap: [AppComponent]
})
export class AppModule { }
