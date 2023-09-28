import { Component, ElementRef, OnInit, HostBinding, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OfertaFormacao } from 'src/app/modules/red-emprega/models/oferta-formacao';
import { FileService } from 'src/app/services/file.service';
import { OfertaFormacaoService } from 'src/app/services/oferta-formacao.service.ts';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from '../../models/User';
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 're-oferta-formacao',
  templateUrl: './oferta-formacao.component.html',
  styleUrls: ['./oferta-formacao.component.scss']
})
export class OfertaFormacaoAdminComponent implements OnInit {

  searchInput = '';
  modalOfertaFormacao = false;
  modalOfertaFormacaoEditar = false;
  adminSelected: User;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  ofertaFormacaoList: OfertaFormacao[] = [];
  ofertaFormacaoForm: FormGroup;
  submittedOferta = false;
  ofertaFormacao: OfertaFormacao = new OfertaFormacao();
  curriculoOpcoes: any;
  @ViewChild('fileUpload') fileUpload: ElementRef;

  constructor(
    private messageService: MessageService,
    private ofertaFormacaoService: OfertaFormacaoService,
    private utilsService: UtilsService,
    private fileService: FileService,
    private tokenStorageService: TokenStorageService,
    private confirmationService: ConfirmationService) { }

  @HostBinding("style.--var-tamanho") tamanhoAtual: string;
  @ViewChild('myDivResposta', { static: false }) myDivResposta: ElementRef;

  ngOnInit(): void {

    this.ofertaFormacaoForm = new FormGroup({
      nome: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      areaFormacao: new FormControl(null, Validators.required),
      local: new FormControl(null, Validators.required),
      horario: new FormControl(null, Validators.required),
      contacto: new FormControl(null, Validators.required),
      observacoes: new FormControl(null, null),
      dataLimite: new FormControl(null, Validators.required),
      emailsAEnviar: new FormControl(null, Validators.required),
    });
    this.getOfertasFormacao();

    this.curriculoOpcoes = [{ label: 'Sim', value: true }, { label: 'Não', value: false }];
  }

  clickEditar(oferta: OfertaFormacao): void {
    this.ofertaFormacao = JSON.parse(JSON.stringify(oferta));
    this.ofertaFormacao.dataLimite = moment(new Date(oferta.dataLimite)).format("DD/MM/YYYY");
    this.ofertaFormacao.files = [];
    oferta.anexos.forEach(anexo => {
      if (anexo?._id) {
        this.fileService.getFile(anexo._id, true).then(
          file => {
            if (file) {
              file.file.name = file.fileName;
              this.ofertaFormacao.files.push(new File([file.file], file.fileName, { type: file.file.type }));
            }
          });
      }
      this.ofertaFormacao.anexos = [];
    });
    this.modalOfertaFormacao = true;
  }


  clickEliminar(oferta: any) {
    this.confirmationService.confirm({
      header: 'Arquivar oferta de formação',
      message: 'Confirmas a arquivação?',
      acceptLabel: 'Confirmo',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.ofertaFormacaoService.removeOfertaFormacao(oferta).then(data => {
          this.getOfertasFormacao();
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

  openModalOfertaFormacao(): void {
    this.ofertaFormacao = new OfertaFormacao();
    this.ofertaFormacao.emailsAEnviar.push(this.tokenStorageService.getUser().email)
    this.modalOfertaFormacao = true;
  }

  closeModalOfertaFormacao() {
    this.modalOfertaFormacao = false;
    this.ofertaFormacaoForm.reset();
  }

  guardarModalOfertaFormacao(): void {
    this.submittedOferta = true;
    this.ofertaFormacaoForm.markAllAsTouched();
    if (this.ofertaFormacaoForm.valid) {
      if (!this.ofertaFormacao._id) {
        this.ofertaFormacaoService.addOfertaFormacao(this.ofertaFormacao).then(data => {
          this.closeModalOfertaFormacao();
          this.getOfertasFormacao();
          this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Oferta de Formação adicionado com sucesso!' });

        }).catch(error => {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: error.message });
        }).finally(() => this.submittedOferta = false);
      } else {
        this.ofertaFormacaoService.updateOfertaFormacao(this.ofertaFormacao).then(data => {
          this.closeModalOfertaFormacao();
          this.getOfertasFormacao();

          this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Oferta de Formação atualizada com sucesso!' });

        }).catch(error => {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: error.message });
        }).finally(() => this.submittedOferta = false);
      }
    }
  }

  getOfertasFormacao() {
    this.ofertaFormacaoService.getOfertasFormacao().then(data => {
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

  removeFile(index) {
    this.ofertaFormacao.files.splice(index, 1)
    this.fileUpload.nativeElement.files = null;
  }

  getAnexo(id: string) {
    this.fileService.getFile(id);
  }

  handleFileInput(event): void {
    if (event.target.files.item(0) && this.ofertaFormacao.files?.length < 2)
      this.ofertaFormacao.files.push(event.target.files.item(0));
    if (event.target.files.item(1) && this.ofertaFormacao.files?.length < 2)
      this.ofertaFormacao.files.push(event.target.files.item(1));

    event.target.value = null;
  }
}
