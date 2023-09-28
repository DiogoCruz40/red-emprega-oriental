import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LayoutComponent } from './components/layout/layout.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { LandingPageComponent } from './components/landing-page/landingpage.component';
import { RedEmpregaRoutingModule } from './red-emprega-routing.module';
import { SobreNosComponent } from './components/sobre-nos/sobre-nos.component';
import { ContactosComponent } from './components/contactos/contactos.component';
import { OfertaEmpregoComponent } from './components/ofertas-emprego/oferta-emprego.component';
import { OfertaFormacaoComponent } from './components/ofertas-formacao/oferta-formacao.component';
import { PoliticaPrivacidadeComponent } from './components/politica-privacidade/politica-privacidade.component';
import { TermosUtilizacaoComponent } from './components/termos-utilizacao/termos-utilizacao.component';
import { RedEmpregaComponent } from './red-emprega.component';
import { CarouselModule } from 'primeng/carousel';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SearchComponent } from './components/search/search.component';
import { ToastModule } from 'primeng/toast';
import { PoliticaPrivacidadeAsModalComponent } from './components/politica-privacidade/politica-privacidade-as-modal/politica-privacidade-as-modal.component';
import { HighlightPipe } from './pipes/highlight.pipe';
import { UnsubscribeComponent } from './components/unsubscribe/unsubscribe.component';
import { CaptchaModule } from 'primeng/captcha';
import { RecaptchaModule } from 'ng-recaptcha';
import { NoticiasComponent } from './components/noticias/noticias.component';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [
    LayoutComponent,
    FooterComponent,
    HeaderComponent,
    LandingPageComponent,
    SobreNosComponent,
    ContactosComponent,
    OfertaEmpregoComponent,
    OfertaFormacaoComponent,
    PoliticaPrivacidadeComponent,
    TermosUtilizacaoComponent,
    RedEmpregaComponent,
    PoliticaPrivacidadeAsModalComponent,
    HighlightPipe,
    SearchComponent,
    UnsubscribeComponent,
    NoticiasComponent
  ],
  imports: [
    BrowserModule,
    RedEmpregaRoutingModule,
    CommonModule,
    CarouselModule,
    TimelineModule,
    CardModule,
    FileUploadModule,
    InputTextModule,
    FormsModule,
    ToastModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    CaptchaModule,
    RecaptchaModule,
    DialogModule

  ],
  providers: [],
  exports: [SearchComponent,
    HighlightPipe]
})
export class RedEmpregaModule { }
