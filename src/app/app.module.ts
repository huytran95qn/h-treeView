import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTreeViewModule } from './components/h-treeView/h-treeView.module';
import { HTreeViewSampleComponent } from './components/h-treeViewSample/h-treeViewSample.component';

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
