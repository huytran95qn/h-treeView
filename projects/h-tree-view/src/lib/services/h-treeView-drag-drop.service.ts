import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { CdkDragMove } from '@angular/cdk/drag-drop';
import { HTreeViewItem } from '../models/h-treeView.model';
import { DropInfoEnum } from '../enums/h-treeView-dragDrop.enum';
import { HTreeViewService } from './h-treeView.service';

export interface DropInfo {
  targetId: string | null | undefined;
  action?: DropInfoEnum;
}

@Injectable({
  providedIn: 'root'
})
export class HTreeViewDragDropService<T> {
  private dropActionTodo: DropInfo | undefined = undefined;

  private nodeLookup: Map<string, HTreeViewItem<T>> = new Map();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private _hTreeViewService: HTreeViewService<T>
  ) { }

  public prepareDragDrop(nodes: HTreeViewItem<T>[]): void {
    this.reset();

    const prepareData = (nodes: HTreeViewItem<T>[]): void => {
      nodes.forEach(node => {
        const { uid, children } = node;
        this.nodeLookup.set(uid, node);
        prepareData(children);
      });
    }

    prepareData(nodes);
  }

  public handleDragMove(event: CdkDragMove<HTreeViewItem<T>>): void {
    const elementAtPointer = this.document.elementFromPoint(
      event.pointerPosition.x,
      event.pointerPosition.y
    );

    if (elementAtPointer) {
      const container = elementAtPointer.classList.contains("h-treeView__cdkDrag")
        ? elementAtPointer
        : elementAtPointer.closest(".h-treeView__cdkDrag");

      if (container) {
        const dropId = container.getAttribute("data-id")!;
        const dragNode = event.source.data;
        const dropNode = this.nodeLookup.get(dropId);
        if(!this.isAncestorNode(dragNode.uid, dropNode)) {
          const action = this.getDropAction(container, event.pointerPosition.y);
          if(action === DropInfoEnum.Inside) {
            this._hTreeViewService.expanded(dropNode);
          }

          this.dropActionTodo = {
            targetId: dropId,
            action: action
          };

          this.showDragInfo();
          return;
        }
      }
    }

    this.clearDragInfo();
  }

  private isAncestorNode(dragId: string, dropNode?: HTreeViewItem<T>) {
    const checkIfAncestorNode = (dragId: string, node?: HTreeViewItem<T>): boolean => {
      if(node) {
        if(node.uid === dragId) {
          return true;
        } else {
          return checkIfAncestorNode(dragId, node.parent)
        }
      }

      return false
    }

    return checkIfAncestorNode(dragId, dropNode)
  }

  private getDropAction(container: Element, pointerY: number): DropInfoEnum {
    const targetRect = container.getBoundingClientRect();
    const oneThird = targetRect.height / 3;
    const distanceFromTop = pointerY - targetRect.top;

    if (distanceFromTop < oneThird) {
      return DropInfoEnum.Before
    } else if (distanceFromTop > 2 * oneThird) {
      return DropInfoEnum.After;
    } else {
      return DropInfoEnum.Inside;
    }
  }

  private showDragInfo(): void {
    this.clearDragInfo();
    if (this.dropActionTodo) {
      const targetId = `node-${this.dropActionTodo.targetId}`;
      const dropAction = `drop-${this.dropActionTodo.action}`
      const targetElement = this.document.getElementById(targetId);
      if(targetElement) {
        targetElement.classList.add(dropAction)
      }
    }
  }

  private clearDragInfo(dropped: boolean = false): void {
    if (dropped) {
      this.dropActionTodo = undefined
    }

    const removeDropClass = (className: string) => {
      this.document.querySelectorAll(`.${className}`)
        .forEach(element => element.classList.remove(className));
    };

    removeDropClass(`drop-${DropInfoEnum.Before}`);
    removeDropClass(`drop-${DropInfoEnum.After}`);
    removeDropClass(`drop-${DropInfoEnum.Inside}`);
  }

  private reset(): void {
    this.dropActionTodo = undefined;
    this.nodeLookup.clear();
  }
}
