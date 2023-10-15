import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HDocSectionComponent } from './h-doc-section/h-doc-section.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [HDocSectionComponent],
  exports: [HDocSectionComponent]
})
export class SharedModule { }
