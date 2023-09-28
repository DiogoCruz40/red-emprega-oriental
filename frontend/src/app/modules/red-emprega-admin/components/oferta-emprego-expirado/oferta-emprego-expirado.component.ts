import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OfertaEmprego } from 'src/app/modules/red-emprega/models/oferta-emprego';
import { FileService } from 'src/app/services/file.service';
import { OfertaEmpregoService } from 'src/app/services/oferta-emprego.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from '../../models/User';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-oferta-emprego-expirado',
  templateUrl: './oferta-emprego-expirado.component.html',
  styleUrls: ['./oferta-emprego-expirado.component.scss']
})
export class OfertaEmpregoExpiradoComponent implements OnInit {

  searchInput = '';
  adminSelected: User;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  modalOfertaEmpregoArquivo = false;
  ofertaEmpregoList: OfertaEmprego[] = [];
  ofertaEmpregoArquivoForm: FormGroup;
  OfertaEmpregoArquivo: OfertaEmprego = new OfertaEmprego();
  submittedAdmin = false;
  constructor(
    private messageService: MessageService,
    private utilsService: UtilsService,
    private confirmationService: ConfirmationService,
    private fileService: FileService,
    private ofertaempregoService: OfertaEmpregoService) { }

  ngOnInit(): void {

    this.ofertaEmpregoArquivoForm = new FormGroup({
      dataLimite: new FormControl(null, Validators.required)
    });
    this.getOfertasEmpregoExpiradas();
  }

  clickDesarquivar(oferta: any) {
    this.OfertaEmpregoArquivo._id = oferta._id;
    this.OfertaEmpregoArquivo.dataLimite = moment(new Date(oferta.dataLimite)).format("DD/MM/YYYY");
    this.modalOfertaEmpregoArquivo = true;

  }
  closeModalOfertaEmprego(): void {
    this.modalOfertaEmpregoArquivo = false;
  }

  guardarModalOfertaEmpregoArquivo(): void {
    this.submittedAdmin = true;
    if (this.ofertaEmpregoArquivoForm.valid) {
      this.ofertaempregoService.renovaOfertaEmprego(this.OfertaEmpregoArquivo).then(data => {
        this.closeModalOfertaEmprego();
        this.getOfertasEmpregoExpiradas();
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Oferta de Emprego renovada com sucesso!' });

      }).catch(error => {
        this.messageService.add({ severity: 'error', summary: 'Erro!', detail: error.message });
      });
    }
  }

  onLerMais(i) {
    let elem: Element = document.getElementById('myDivResposta' + i)
    this.ofertaEmpregoList[i].tamanho = elem.scrollHeight + 25 + 'px';
    if (!this.ofertaEmpregoList[i].lerMais) {
      this.ofertaEmpregoList[i].tamanho = null;
    }
    this.ofertaEmpregoList[i].lerMais = !this.ofertaEmpregoList[i].lerMais
  }

  getAnexo(id: string) {
    this.fileService.getFile(id);
  }

  clickEliminar(oferta: any) {
    this.confirmationService.confirm({
      header: 'Arquivar oferta de emprego',
      message: 'Confirmas a arquivação?',
      acceptLabel: 'Confirmo',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.ofertaempregoService.removeOfertaEmprego(oferta).then(data => {
          this.getOfertasEmpregoExpiradas();
          this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Oferta de Emprego eliminada com sucesso!' });

        }).catch(error => {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: error.message });
        });
      }
    });
  }

  getOfertasEmpregoExpiradas() {
    this.ofertaempregoService.getOfertasEmpregoExpirado().then(data => {
      if (data) {
        this.ofertaEmpregoList = data;
        this.ofertaEmpregoList.forEach(oferta => {
          if (oferta.observacoes)
            oferta.observacoesAMostrar = this.utilsService.linkify(oferta.observacoes)
          oferta.lerMais = true
        });
      }
    }).catch(error => this.messageService.add({ severity: 'error', summary: 'Erro!', detail: error.message }));
  }
}