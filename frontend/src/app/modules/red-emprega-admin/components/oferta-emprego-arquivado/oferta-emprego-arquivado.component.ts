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
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 'app-oferta-emprego-arquivado',
  templateUrl: './oferta-emprego-arquivado.component.html',
  styleUrls: ['./oferta-emprego-arquivado.component.scss']
})
export class OfertaEmpregoArquivadoComponent implements OnInit {
  searchInput = '';
  adminSelected: User;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  modalOfertaEmpregoApagado = false;
  ofertaEmpregoList: OfertaEmprego[] = [];
  ofertaEmpregoApagadoForm: FormGroup;
  OfertaEmpregoApagado: OfertaEmprego = new OfertaEmprego();
  submittedAdmin = false;
  omnipotente = false;
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fileService: FileService,
    private utilsService: UtilsService,
    private tokenStorageService: TokenStorageService,
    private ofertaEmpregoService: OfertaEmpregoService) { }

  ngOnInit(): void {

    this.ofertaEmpregoApagadoForm = new FormGroup({
      dataLimite: new FormControl(null, Validators.required)
    });
    this.omnipotente = this.tokenStorageService.getUser().omnipotente;
    this.getOfertasEmpregoArquivadas();
  }

  clickRestaurar(oferta: any) {
    this.OfertaEmpregoApagado._id = oferta._id;
    this.OfertaEmpregoApagado.dataLimite = moment(new Date(oferta.dataLimite)).format("DD/MM/YYYY");
    this.modalOfertaEmpregoApagado = true;

  }
  closeModalOfertaEmprego(): void {
    this.modalOfertaEmpregoApagado = false;
  }

  guardarmodalOfertaEmpregoDesarquivado(): void {
    this.submittedAdmin = true;
    if (this.ofertaEmpregoApagadoForm.valid) {
      this.ofertaEmpregoService.desarquivaOfertaEmprego(this.OfertaEmpregoApagado).then(data => {
        this.closeModalOfertaEmprego();
        this.getOfertasEmpregoArquivadas();

        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Oferta de Emprego desarquivada com sucesso!' });

      }).catch(error => {
        this.messageService.add({ severity: 'error', summary: 'Erro!', detail: error.message });
      });
    }

  }

  getAnexo(id: string) {
    this.fileService.getFile(id);
  }

  clickEliminar(oferta: OfertaEmprego) {
    this.confirmationService.confirm({
      header: 'Eliminar Permanentemente',
      message: 'Confirma que pretende eliminar permanentemente a oferta <strong>' + oferta.nome + '</strong> ?',
      acceptLabel: 'Confirmo',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.ofertaEmpregoService.removeOfertaEmpregoHard(oferta).then(data => {
          this.getOfertasEmpregoArquivadas();
          this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Oferta de Emprego eliminada permanentemente com sucesso!' });

        }).catch(error => {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: error.message });
        });
      }
    });
  }

  onLerMais(i) {
    let elem: Element = document.getElementById('myDivResposta' + i)
    this.ofertaEmpregoList[i].tamanho = elem.scrollHeight + 25 + 'px';
    if (!this.ofertaEmpregoList[i].lerMais) {
      this.ofertaEmpregoList[i].tamanho = null;
    }
    this.ofertaEmpregoList[i].lerMais = !this.ofertaEmpregoList[i].lerMais
  }

  getOfertasEmpregoArquivadas() {
    this.ofertaEmpregoService.getOfertasEmpregoArquivadas().then(data => {
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