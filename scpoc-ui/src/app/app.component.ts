import { Component } from '@angular/core';
import { TimelineElement } from './shared/timeline/timeline-elements';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  content = 'Hello';
}
