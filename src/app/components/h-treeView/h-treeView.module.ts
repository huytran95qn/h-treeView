import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { HTreeViewComponent } from './h-treeView.component';
import { HVirtualFor } from './directives/h-virtual-for-of.directive';

const COMPONENTS = [
  HTreeViewComponent,
];

const MATERIAL_MODULES = [
  MatIconModule,
  ScrollingModule
];

const COMMON_MODULES = [
  CommonModule
];

@NgModule({
  declarations: [
    ...COMPONENTS,
    HVirtualFor
  ],
  imports: [
    ...MATERIAL_MODULES,
    ...COMMON_MODULES,
  ],
  exports: [
    HTreeViewComponent,
    HVirtualFor
  ]
})
export class HTreeViewModule { }
