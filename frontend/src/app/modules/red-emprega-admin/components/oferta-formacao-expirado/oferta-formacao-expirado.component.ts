import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OfertaFormacao } from 'src/app/modules/red-emprega/models/oferta-formacao';
import { FileService } from 'src/app/services/file.service';
import { OfertaFormacaoService } from 'src/app/services/oferta-formacao.service.ts';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from '../../models/User';

@Component({
  selector: 'app-oferta-formacao-expirado',
  templateUrl: './oferta-formacao-expirado.component.html',
  styleUrls: ['./oferta-formacao-expirado.component.scss']
})
export class OfertaFormacaoExpiradoComponent implements OnInit {

  searchInput = '';
  adminSelected: User;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  modalOfertaFormacaoExpirado = false;
  ofertaFormacaoList: OfertaFormacao[] = [];
  ofertaFormacaoExpiradoForm: FormGroup;
  OfertaFormacaoExpirado: OfertaFormacao = new OfertaFormacao();
  submittedAdmin = false;
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fileService: FileService,
    private utilsService: UtilsService,
    private ofertaFormacaoService: OfertaFormacaoService) { }

  ngOnInit(): void {

    this.ofertaFormacaoExpiradoForm = new FormGroup({
      dataLimite: new FormControl(null, Validators.required)
    });
    this.getOfertasFormacaoExpiradas();
  }

  clickDesarquivar(oferta: any) {
    this.OfertaFormacaoExpirado._id = oferta._id;
    this.OfertaFormacaoExpirado.dataLimite = new Date(oferta.dataLimite);
    this.modalOfertaFormacaoExpirado = true;

  }
  closeModalOfertaFormacao(): void {
    this.modalOfertaFormacaoExpirado = false;
  }

  guardarModalOfertaFormacaoExpirado(): void {
    this.submittedAdmin = true;
    if (this.ofertaFormacaoExpiradoForm.valid) {
      this.ofertaFormacaoService.renovaOfertaFormacao(this.OfertaFormacaoExpirado).then(data => {
        this.closeModalOfertaFormacao();
        this.getOfertasFormacaoExpiradas();
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Oferta de Formação renovada com sucesso!' });

      }).catch(error => {
        this.messageService.add({ severity: 'error', summary: 'Erro!', detail: error.message });
      });
    }

  }

  getAnexo(id: string) {
    this.fileService.getFile(id);
  }

  onLerMais(i) {
    let elem: Element = document.getElementById('myDivResposta' + i)
    this.ofertaFormacaoList[i].tamanho = elem.scrollHeight + 25 + 'px';
    if (!this.ofertaFormacaoList[i].lerMais) {
      this.ofertaFormacaoList[i].tamanho = null;
    }
    this.ofertaFormacaoList[i].lerMais = !this.ofertaFormacaoList[i].lerMais
  }


  clickEliminar(oferta: any) {
    this.confirmationService.confirm({
      header: 'Arquivar oferta de formação',
      message: 'Confirmas a arquivação?',
      acceptLabel: 'Confirmo',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.ofertaFormacaoService.removeOfertaFormacao(oferta).then(data => {
          this.getOfertasFormacaoExpiradas();
          this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Oferta de Formação eliminada com sucesso!' });

        }).catch(error => {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: error.message });
        });
      }
    });
  }

  getOfertasFormacaoExpiradas() {
    this.ofertaFormacaoService.getOfertasFormacaoExpiradas().then(data => {
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