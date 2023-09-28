import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactosComponent } from './components/contactos/contactos.component';
import { LandingPageComponent } from './components/landing-page/landingpage.component';
import { LayoutComponent } from './components/layout/layout.component';
import { OfertaEmpregoComponent } from './components/ofertas-emprego/oferta-emprego.component';
import { OfertaFormacaoComponent } from './components/ofertas-formacao/oferta-formacao.component';
import { SobreNosComponent } from './components/sobre-nos/sobre-nos.component';
import { PoliticaPrivacidadeComponent } from './components/politica-privacidade/politica-privacidade.component';
import { TermosUtilizacaoComponent } from './components/termos-utilizacao/termos-utilizacao.component';
import { RedEmpregaComponent } from './red-emprega.component';
import { UnsubscribeComponent } from './components/unsubscribe/unsubscribe.component';
import { NoticiasComponent } from './components/noticias/noticias.component';

export const routes: Routes = [
  {
    path: '',
    component: RedEmpregaComponent,
    children: [
      {
        path: '',
        component: LayoutComponent,
        children: [
          {
            path: '',
            component: LandingPageComponent,
          },
          {
            path: 'sobre-nos',
            component: SobreNosComponent,
          },
          {
            path: 'ofertas-emprego',
            component: OfertaEmpregoComponent,
          },
          {
            path: 'ofertas-formacao',
            component: OfertaFormacaoComponent,
          },
          {
            path: 'noticias',
            component: NoticiasComponent,
          },
          {
            path: 'contactos',
            component: ContactosComponent,
          },
          {
            path: 'politica-privacidade',
            component: PoliticaPrivacidadeComponent,
          },
          {
            path: 'termos-utilizacao',
            component: TermosUtilizacaoComponent,
          }
        ],
      },
    ],
  },
  {
    path: 'unsubscribe',
    component: UnsubscribeComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class RedEmpregaRoutingModule {}
