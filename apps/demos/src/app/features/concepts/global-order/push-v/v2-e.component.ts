import { ChangeDetectionStrategy, Component } from '@angular/core';
@Component({
  selector: 'rxa-v2-e',
  template: `
    <rxa-visualizer>
      <div visualizerHeader>
        <h1>E<small>v2</small></h1>
      </div>
    </rxa-visualizer>
  `,
  host: { class: 'w-100' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class V2EComponent {
  constructor() {}
}
