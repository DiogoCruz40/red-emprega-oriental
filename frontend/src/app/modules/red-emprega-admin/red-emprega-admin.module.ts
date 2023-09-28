import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { RegisterComponent } from './components/register/register.component';
import { RedEmpregaRoutingAdminModule } from './red-emprega-admin-routing.module';
import { RedEmpregaAdminComponent } from './red-emprega-admin.component';
import { AuthGuardService } from './services/auth-guard.service';
import { authInterceptorProviders } from './services/http-interceptor.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GestaoAdminsService } from './services/gestao-admins.service';
import { ManageAdminsComponent } from './components/manage-admins/manage-admins.component';
import { OfertaEmpregoAdminComponent } from './components/oferta-emprego/oferta-emprego.component';
import { OfertaFormacaoAdminComponent } from './components/oferta-formacao/oferta-formacao.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { MatMenuModule } from '@angular/material/menu';
import { OfertaEmpregoExpiradoComponent } from './components/oferta-emprego-expirado/oferta-emprego-expirado.component';
import { MenuModule } from 'primeng/menu';
import { OfertaEmpregoArquivadoComponent } from './components/oferta-emprego-arquivado/oferta-emprego-arquivado.component';
import { OfertaFormacaoExpiradoComponent } from './components/oferta-formacao-expirado/oferta-formacao-expirado.component';
import { RedEmpregaModule } from '../red-emprega/red-emprega.module';
import { CaptchaModule } from 'primeng/captcha';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatDateFormats, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { OfertaFormacaoArquivadoComponent } from './components/oferta-formacao-arquivado/oferta-formacao-arquivado.component';
import { NoticiaAdminComponent } from './components/noticia/noticia.component';
import {LOCALE_ID} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt-PT';
import {ChipsModule} from 'primeng/chips';
import { NoticiaArquivadoComponent } from './components/noticia-arquivado/noticia-arquivado.component';

registerLocaleData(localePt);
export const MOMENT_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'D/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM Y',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM Y'
  }
};

@NgModule({
  declarations: [
    InicioComponent,
    RegisterComponent,
    LoginComponent,
    RedEmpregaAdminComponent,
    PerfilComponent,
    ManageAdminsComponent,
    OfertaEmpregoAdminComponent,
    OfertaFormacaoAdminComponent,
    SidebarComponent,
    OfertaEmpregoArquivadoComponent,
    OfertaEmpregoExpiradoComponent,
    OfertaFormacaoExpiradoComponent,
    OfertaFormacaoArquivadoComponent,
    NoticiaAdminComponent,
    NoticiaArquivadoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    CalendarModule,
    RedEmpregaRoutingAdminModule,
    CommonModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatDialogModule,
    SelectButtonModule,
    MatFormFieldModule,
    MatInputModule,
    DialogModule,
    InputTextModule,
    MatMenuModule,
    ConfirmDialogModule,
    MenuModule,
    CaptchaModule,
    RedEmpregaModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ChipsModule
  ],
  providers: [
    AuthGuardService,
    authInterceptorProviders,
    MessageService,
    GestaoAdminsService,
    ConfirmationService,
    { provide: LOCALE_ID, useValue: 'pt-PT' },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-PT' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},

  ],
  exports: []
})
export class RedEmpregaAdminModule { }
