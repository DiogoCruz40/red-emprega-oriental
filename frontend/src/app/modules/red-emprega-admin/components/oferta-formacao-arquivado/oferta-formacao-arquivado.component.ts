import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OfertaFormacao } from 'src/app/modules/red-emprega/models/oferta-formacao';
import { FileService } from 'src/app/services/file.service';
import { OfertaFormacaoService } from 'src/app/services/oferta-formacao.service.ts';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from '../../models/User';
import { AuthService } from '../../services/auth.service';
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 'app-oferta-formacao-arquivado',
  templateUrl: './oferta-formacao-arquivado.component.html',
  styleUrls: ['./oferta-formacao-arquivado.component.scss']
})
export class OfertaFormacaoArquivadoComponent implements OnInit {
  form: any = {
    username: null,
    email: null,
    password: null
  };
  searchInput = '';
  adminSelected: User;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  modalOfertasFormacaoArquivada = false;
  ofertaFormacaoList: OfertaFormacao[] = [];
  ofertasFormacaoArquivadaForm: FormGroup;
  ofertaFormacaoArquivada: OfertaFormacao = new OfertaFormacao();
  submittedAdmin = false;
  omnipotente = false;
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private tokenStorageService: TokenStorageService,
    private utilsService: UtilsService,
    private fileService: FileService,
    private ofertaFormacaoService: OfertaFormacaoService) { }

  ngOnInit(): void {

    this.ofertasFormacaoArquivadaForm = new FormGroup({
      dataLimite: new FormControl(null, Validators.required)
    });

    this.omnipotente = this.tokenStorageService.getUser().omnipotente;
    this.getOfertasFormacaoArquivadas();
  }

  clickRestaurar(oferta: any) {
    this.ofertaFormacaoArquivada._id = oferta._id;
    this.ofertaFormacaoArquivada.dataLimite = moment(new Date(oferta.dataLimite)).format("DD/MM/YYYY");
    this.modalOfertasFormacaoArquivada = true;

  }
  closeModalOfertasFormacao(): void {
    this.modalOfertasFormacaoArquivada = false;
  }

  guardarmodalOfertasFormacaoArquivada(): void {
    this.submittedAdmin = true;
    if (this.ofertasFormacaoArquivadaForm.valid) {
      this.ofertaFormacaoService.desarquivaOfertaFormacao(this.ofertaFormacaoArquivada).then(data => {
        this.closeModalOfertasFormacao();
        this.getOfertasFormacaoArquivadas();
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Oferta de Formação desarquivada com sucesso!' });

      }).catch(
        error => this.messageService.add({ severity: 'error', summary: 'Erro!', detail: error.message }));
    }
  }

  getAnexo(id: string) {
    this.fileService.getFile(id);
  }

  clickEliminar(oferta: any) {
    this.confirmationService.confirm({
      message: 'Confirma que pretende eliminar permanentemente a oferta de formação <strong>' + oferta.nome + '</strong> ?',
      acceptLabel: 'Confirmo',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.ofertaFormacaoService.removeOfertaFormacaoHard(oferta).then(data => {
          this.getOfertasFormacaoArquivadas();
          this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Oferta de Formação eliminada com sucesso!' });

        }).catch(error => {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: error.message });
        });
      }
    });
  }

  onLerMais(i) {
    let elem: Element = document.getElementById('myDivResposta' + i)
    this.ofertaFormacaoList[i].tamanho = elem.scrollHeight + 25 + 'px';
    if (!this.ofertaFormacaoList[i].lerMais) {
      this.ofertaFormacaoList[i].tamanho = null;
    }
    this.ofertaFormacaoList[i].lerMais = !this.ofertaFormacaoList[i].lerMais
  }

  getOfertasFormacaoArquivadas() {
    this.ofertaFormacaoService.getOfertasFormacaoArquivadas().then(data => {
      if (data) {
        this.ofertaFormacaoList = data;
        this.ofertaFormacaoList.forEach(oferta => {
          if (oferta.observacoes)
            oferta.observacoesAMostrar = this.utilsService.linkify(oferta.observacoes)
          oferta.lerMais = true
        });
      }
    }).catch(error => {
      this.messageService.add({ severity: 'error', summary: 'Erro!', detail: error.message });
    });
  }
}