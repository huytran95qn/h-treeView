import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTreeViewModule } from 'projects/h-tree-view/src/public-api';
import { BasicDocsComponent } from './components/basic-doc/basic-doc.component';
import { HDocsectionComponent } from './components/h-docsection/h-docsection.component';
@NgModule({
  declarations: [
    AppComponent,
    BasicDocsComponent,
    HDocsectionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HTreeViewModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
