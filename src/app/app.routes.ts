import { Routes } from '@angular/router';
import { EventTimelineComponent } from './components/event-timeline/event-timeline.component';

export const routes: Routes = [
  {
    path: '',
    component: EventTimelineComponent,
  },
  {
    path: 'timeline',
    component: EventTimelineComponent,
  },
];
