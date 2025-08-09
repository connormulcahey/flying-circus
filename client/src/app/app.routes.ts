import { Routes } from '@angular/router';
import { App } from './app';
import { PostDetailComponent } from './post-detail.component';

export const routes: Routes = [
  { path: '', component: App },
  { path: 'post/:id', component: PostDetailComponent },
  { path: '**', redirectTo: '' }
];
