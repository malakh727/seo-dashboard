import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home';
import { HistoryPage } from './pages/history/history';
import { ComparePage } from './pages/compare/compare';
import { ReportPage } from './pages/report/report';
import { TipsPage } from './pages/tips/tips';

export const routes: Routes = [
  { path: '',        component: HomePage },
  { path: 'history', component: HistoryPage },
  { path: 'compare', component: ComparePage },
  { path: 'report',  component: ReportPage },
  { path: 'tips',    component: TipsPage },
  { path: '**',      redirectTo: '' },
];
