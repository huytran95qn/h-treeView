import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTreeViewSampleComponent } from './components/h-treeViewSample/h-treeViewSample.component';
import { HTreeViewModule } from 'projects/h-tree-view/src/public-api';
// import { HTreeViewModule } from 'h-treeView';

@NgModule({
  declarations: [
    AppComponent,
    HTreeViewSampleComponent
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
