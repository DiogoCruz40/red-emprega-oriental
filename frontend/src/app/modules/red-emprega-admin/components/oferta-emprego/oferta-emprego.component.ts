import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, ElementRef, HostBinding, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { OfertaEmprego } from 'src/app/modules/red-emprega/models/oferta-emprego';
import { FileService } from 'src/app/services/file.service';
import { OfertaEmpregoService } from 'src/app/services/oferta-emprego.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from '../../models/User';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 're-oferta-emprego',
  templateUrl: './oferta-emprego.component.html',
  styleUrls: ['./oferta-emprego.component.scss']
})
export class OfertaEmpregoAdminComponent implements OnInit {
  searchInput = '';
  modalOfertaEmprego = false;
  adminSelected: User;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  ofertaEmpregoList: OfertaEmprego[] = [];
  ofertaEmpregoForm: FormGroup;
  submittedOferta = false;
  ofertaEmprego: OfertaEmprego = new OfertaEmprego();
  curriculoOpcoes: any;
  @ViewChild('fileUpload') fileUpload: ElementRef;
  @HostBinding("style.--var-tamanho") tamanhoAtual: string;
  @ViewChild('myDivResposta', { static: false }) myDivResposta: ElementRef;

  constructor(
    private messageService: MessageService,
    private ofertaEmpregoService: OfertaEmpregoService,
    private utilsService: UtilsService,
    private fileService: FileService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {

    this.ofertaEmpregoForm = new FormGroup({
      nome: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      funcao: new FormControl(null, Validators.required),
      local: new FormControl(null, Validators.required),
      outrasRegalias: new FormControl(null, Validators.required),
      perfilExperienciaProfissional: new FormControl(null, Validators.required),
      remuneracao: new FormControl(null, Validators.required),
      horario: new FormControl(null, Validators.required),
      contacto: new FormControl(null, Validators.required),
      observacoes: new FormControl(null, null),
      dataLimite: new FormControl(null, Validators.required),
      curriculo: new FormControl(null, null)
    });

    this.getOfertasEmprego();
    this.curriculoOpcoes = [{ label: 'Sim', value: true }, { label: 'Não', value: false }];

  }



  clickEditar(oferta: any): void {
    this.ofertaEmprego = JSON.parse(JSON.stringify(oferta));
    this.ofertaEmprego.dataLimite = moment(new Date(oferta.dataLimite)).format("DD/MM/YYYY");
    this.ofertaEmprego.files = [];
    oferta.anexos.forEach(anexo => {
      if (anexo?._id) {
        this.fileService.getFile(anexo._id, true).then(
          file => {
            if (file) {
              file.file.name = file.fileName;
              this.ofertaEmprego.files.push(new File([file.file], file.fileName, { type: file.file.type }));
            }
          });
      }
      this.ofertaEmprego.anexos = [];
    });
    this.modalOfertaEmprego = true;
  }

  guardarModalOfertaEmpregoEditar(): void {
    this.submittedOferta = true;
    this.ofertaEmpregoForm.markAllAsTouched();
    if (this.ofertaEmpregoForm.valid) {
      this.ofertaEmpregoService.updateOfertaEmprego(this.ofertaEmprego).then(data => {
        this.closeModalOfertaEmprego();
        this.ofertaEmpregoService.getOfertasEmprego().then(data => {
          this.ofertaEmpregoList = data;
        }).catch(error => {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: error.message });
        });
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Oferta de Emprego atualizada com sucesso!' });

      }).catch(error => {
        this.messageService.add({ severity: 'error', summary: 'Erro!', detail: error.message });
      });
    }
  }

  clickEliminar(oferta: any) {
    this.confirmationService.confirm({
      header: 'Arquivar oferta de emprego',
      message: 'Confirmas a arquivação?',
      acceptLabel: 'Confirmo',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.ofertaEmpregoService.removeOfertaEmprego(oferta).then(data => {
          this.getOfertasEmprego();

          this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Oferta de Emprego eliminada com sucesso!' });

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
  getAnexo(id: string) {
    this.fileService.getFile(id);
  }

  openModalOfertaEmprego(): void {
    this.ofertaEmprego = new OfertaEmprego();
    this.ofertaEmprego.curriculo = false;
    this.modalOfertaEmprego = true;
  }

  closeModalOfertaEmprego() {
    this.modalOfertaEmprego = false;
    this.ofertaEmpregoForm.reset();
    this.submittedOferta = false;
  }

  guardarModalOfertaEmprego(): void {

    this.submittedOferta = true;
    this.ofertaEmpregoForm.markAllAsTouched();
    if (this.ofertaEmpregoForm.valid) {
      if (!this.ofertaEmprego._id) {
        this.ofertaEmpregoService.addOfertaEmprego(this.ofertaEmprego).then(data => {
          this.closeModalOfertaEmprego();
          this.getOfertasEmprego();

          this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Oferta de Emprego adicionado com sucesso!' });

        }).catch(error => {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: error.message });
        }).finally(() => this.submittedOferta = false);
      } else {
        this.ofertaEmpregoService.updateOfertaEmprego(this.ofertaEmprego).then(data => {
          this.closeModalOfertaEmprego();
          this.getOfertasEmprego();

          this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Oferta de Emprego atualizada com sucesso!' });

        }).catch(error => {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: error.message });
        }).finally(() => this.submittedOferta = false);
      }
    }
  }

  handleFileInput(event): void {
    if (event.target.files.item(0) && this.ofertaEmprego.files.length < 2)
      this.ofertaEmprego.files.push(event.target.files.item(0));
    if (event.target.files.item(1) && this.ofertaEmprego.files.length < 2)
      this.ofertaEmprego.files.push(event.target.files.item(1));

    event.target.value = null;
  }

  removeFile(index) {
    this.ofertaEmprego.files.splice(index, 1)
    this.fileUpload.nativeElement.files = null;
  }

  getOfertasEmprego() {
    this.ofertaEmpregoService.getOfertasEmprego().then(data => {
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
