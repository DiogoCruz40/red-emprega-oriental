import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Noticia } from '../red-emprega/models/noticia';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { ManageAdminsComponent } from './components/manage-admins/manage-admins.component';
import { NoticiaArquivadoComponent } from './components/noticia-arquivado/noticia-arquivado.component';
import { NoticiaAdminComponent } from './components/noticia/noticia.component';
import { OfertaEmpregoArquivadoComponent } from './components/oferta-emprego-arquivado/oferta-emprego-arquivado.component';
import { OfertaEmpregoExpiradoComponent } from './components/oferta-emprego-expirado/oferta-emprego-expirado.component';
import { OfertaEmpregoAdminComponent } from './components/oferta-emprego/oferta-emprego.component';
import { OfertaFormacaoArquivadoComponent } from './components/oferta-formacao-arquivado/oferta-formacao-arquivado.component';
import { OfertaFormacaoExpiradoComponent } from './components/oferta-formacao-expirado/oferta-formacao-expirado.component';
import { OfertaFormacaoAdminComponent } from './components/oferta-formacao/oferta-formacao.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { RegisterComponent } from './components/register/register.component';
import { RedEmpregaAdminComponent } from './red-emprega-admin.component';
import { AuthGuardService } from './services/auth-guard.service';

export const routes: Routes = [
  {
    path: '',
    component: RedEmpregaAdminComponent,
    children: [

      {
        path: 'admin/iniciar-sessao',
        component: LoginComponent
      },
      {
        path: 'admin',
        component: PerfilComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'admin/perfil',
        component: PerfilComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'admin/gestao-admins',
        component: ManageAdminsComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'admin/oferta-emprego',
        component: OfertaEmpregoAdminComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'admin/oferta-emprego-arquivado',
        component: OfertaEmpregoArquivadoComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'admin/oferta-emprego-expirado',
        component: OfertaEmpregoExpiradoComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'admin/oferta-formacao',
        component: OfertaFormacaoAdminComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'admin/oferta-formacao-expirado',
        component: OfertaFormacaoExpiradoComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'admin/oferta-formacao-arquivado',
        component: OfertaFormacaoArquivadoComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'admin/noticia',
        component: NoticiaAdminComponent,
        canActivate: [AuthGuardService]
      },

      {
        path: 'admin/noticia-arquivado',
        component: NoticiaArquivadoComponent,
        canActivate: [AuthGuardService]
      },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RedEmpregaRoutingAdminModule { }
