import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'h-doc-section',
  templateUrl: './h-doc-section.component.html',
  styleUrls: ['./h-doc-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HDocSectionComponent {
  @Input() title!: string;
}
