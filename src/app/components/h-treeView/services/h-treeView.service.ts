import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { HTreeViewItem } from "../models/h-treeView.model";
import { toggleExpandOrCollapse } from "../utils/utils";
import { v4 as uuid } from 'uuid';
import { HTreeViewState } from "../models/h-treeView-state.model";


@Injectable({ providedIn: 'root' })
export class HTreeViewService<T> {
    private $treeViewAction: Subject<HTreeViewState<T>> = new Subject();

    treeViewSelector(): Observable<HTreeViewState<T>> {
        return this.$treeViewAction.asObservable();
    }

    toggle(node: HTreeViewItem<T>): void {
        toggleExpandOrCollapse(node);
        this.$treeViewAction.next({state: 'toogle', node });
    }

    addTree(node: HTreeViewItem<T>, data: T, label: string, uid?: string): void {
        uid = uid || uuid();
        let orgUnit = new HTreeViewItem<T>({
            uid,
            label,
            data
        });
        orgUnit.parent = node;
        orgUnit.level = node.level + 1;
        node.children.push(orgUnit);

        this.$treeViewAction.next({state: "add", node });
    }

    deleteTree(node: HTreeViewItem<T>): void {
        let parent = node.parent;
        if (parent) {
            parent.children = parent.children.filter(child => child.uid !== node.uid);
        }

        this.$treeViewAction.next({state: 'delete', node });
    }

    update(node: HTreeViewItem<T>, data: T): void {
        node.data = data;
        this.$treeViewAction.next({state: 'update', node });
    }
}