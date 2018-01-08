import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineComponent } from './timeline.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [TimelineComponent],
  declarations: [TimelineComponent]
})
export class TimelineModule { }
