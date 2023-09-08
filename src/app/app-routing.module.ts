import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurveEditorComponent } from './components/curve-editor/curve-editor.component';

const routes: Routes = [
  { path: '', component: CurveEditorComponent },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
