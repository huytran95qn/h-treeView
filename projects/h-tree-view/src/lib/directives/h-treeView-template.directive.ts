import { Directive, Input, TemplateRef } from '@angular/core';
import { HTreeViewTemplate } from '../enums/h-treeView.enum';

@Directive({
  selector: '[hTreeViewTemplate]'
})
export class HTreeViewTemplateDirective {
  @Input('hTemplate') name: HTreeViewTemplate | undefined;

  constructor(public template: TemplateRef<HTMLElement>) {}

  getType(): HTreeViewTemplate {
    return this.name!;
  }
}
