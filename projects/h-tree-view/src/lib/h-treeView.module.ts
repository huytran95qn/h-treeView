import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { HTreeViewComponent } from './h-treeView.component';
import { HTreeViewService } from './services/h-treeView.service';
import { HTreeViewVirtualFor } from './directives/h-treeView-virtual-for-of.directive';
import { HTreeViewTemplateDirective } from './directives/h-treeView-template.directive';

const COMPONENTS = [
  HTreeViewComponent,
];

const DIRECTIVES = [
  HTreeViewTemplateDirective,
  HTreeViewVirtualFor
]

const MATERIAL_MODULES = [
  MatIconModule,
  ScrollingModule,
  DragDropModule
];

const COMMON_MODULES = [
  CommonModule
];

@NgModule({
  declarations: [
    ...COMPONENTS,
    ...DIRECTIVES
  ],
  imports: [
    ...MATERIAL_MODULES,
    ...COMMON_MODULES,
  ],
  exports: [
    HTreeViewComponent,
    HTreeViewTemplateDirective
  ],
  providers: [
    HTreeViewService
  ]
})
export class HTreeViewModule { }
