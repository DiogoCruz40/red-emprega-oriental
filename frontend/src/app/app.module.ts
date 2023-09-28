import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RedEmpregaAdminModule } from './modules/red-emprega-admin/red-emprega-admin.module';
import { RedEmpregaModule } from './modules/red-emprega/red-emprega.module';
import { OfertaEmpregoService } from './services/oferta-emprego.service';
import { OfertaFormacaoService } from './services/oferta-formacao.service.ts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APIClientService } from './services/apiclient.service';
import { RecaptchaModule } from 'ng-recaptcha';
import { FileService } from './services/file.service';
import { UtilsService } from './services/utils.service';

@NgModule({

  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    RedEmpregaModule,
    RedEmpregaAdminModule,
    AppRoutingModule,
    BrowserAnimationsModule,

  ],
  declarations: [
    AppComponent
  ],
  providers: [
    OfertaEmpregoService,
    OfertaFormacaoService,
    APIClientService,
    FileService,
    UtilsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
