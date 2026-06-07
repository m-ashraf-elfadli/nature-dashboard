import { Routes } from '@angular/router';

export const environmentalCalendarRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './components/environmental-events/environmental-events.component'
      ).then((m) => m.EnvironmentalEventsComponent),
    data: {
      breadcrumb: 'environmental_calendar.breadcrumb',
    },
  },
];
