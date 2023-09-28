import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: 'app/modules/red-emprega/red-emprega.module#RedEmpregaModule'
  },
  {
    path: 'admin',
    loadChildren: 'app/modules/red-emprega/red-emprega-admin.module#RedEmpregaAdminModule'
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
