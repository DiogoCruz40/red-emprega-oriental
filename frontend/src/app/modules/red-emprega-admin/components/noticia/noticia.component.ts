import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, ElementRef, HostBinding, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { Noticia } from 'src/app/modules/red-emprega/models/noticia';
import { OfertaEmprego } from 'src/app/modules/red-emprega/models/oferta-emprego';
import { FileService } from 'src/app/services/file.service';
import { NoticiaService } from 'src/app/services/noticia.service';
import { OfertaEmpregoService } from 'src/app/services/oferta-emprego.service';
import { User } from '../../models/User';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 're-noticia',
  templateUrl: './noticia.component.html',
  styleUrls: ['./noticia.component.scss']
})
export class NoticiaAdminComponent implements OnInit {
  searchInput = '';
  modalNoticia = false;
  modalNewNoticia = false;
  adminSelected: User;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  noticiaList: Noticia[] = [];
  noticiaForm: FormGroup;
  submittedNoticia = false;
  noticia: Noticia = new Noticia();
  noticiaSelecionada: Noticia = new Noticia();
  @ViewChild('fileUpload') fileUpload: ElementRef;
  @ViewChild('fileUploadPreVisualizar') fileUploadPreVisualizar: ElementRef;

  @HostBinding("style.--var-tamanho") tamanhoAtual: string;
  @ViewChild('myDivResposta', { static: false }) myDivResposta: ElementRef;

  constructor(
    private messageService: MessageService,
    private noticiaService: NoticiaService,
    private fileService: FileService,
    private sanitizer: DomSanitizer,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {

    this.noticiaForm = new FormGroup({
      titulo: new FormControl(null, Validators.required),
      descricao: new FormControl(null, Validators.required),
    });

    this.getNoticias()
  }

  clickEditar(noticia: Noticia): void {
    this.noticia = JSON.parse(JSON.stringify(noticia));
    this.noticia.filePreVisualizar = noticia.filePreVisualizar;
    this.noticia.files = [];
    this.noticia.anexos.forEach(anexo => {
      if (anexo?._id) {
        this.fileService.getFile(anexo._id, true).then(
          file => {
            if (file) {
              file.file.name = file.fileName;
              this.noticia.files.push(new File([file.file], file.fileName, { type: file.file.type }));
            }
          });
      }
      this.noticia.anexos = [];
    });
    this.modalNewNoticia = true;
  }

  clickEliminar(noticia: any) {
    this.confirmationService.confirm({
      header: 'Arquivar notícia',
      message: 'Confirmas a arquivação?',
      acceptLabel: 'Confirmo',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.noticiaService.removeNoticia(noticia).then(data => {
          this.getNoticias();
          this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Notícia eliminada com sucesso!' });

        }).catch(error => {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: error.message });
        });
      }
    });

  }

  getNoticias() {
    this.noticiaService.getNoticias().then(data => {
      if (data) {
        this.noticiaList = data;
        this.noticiaList.forEach(noticia => {
          if (noticia.preVisualizar?._id) {
            this.fileService.getFile(noticia.preVisualizar._id, true).then(
              file => {
                if (file) {
                  file.file.name = file.fileName;
                  noticia.filePreVisualizar = new File([file.file], file.fileName, { type: file.file.type });
                  var urlCreator = window.URL || window.webkitURL;
                  let objectURL = urlCreator.createObjectURL(file.file);
                  noticia.imgPrevisualizar = this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
                }
              });
          }
          noticia.lerMais = true
        });
      }
    }).catch(error => this.messageService.add({ severity: 'error', summary: 'Erro!', detail: error.message }));
  }

  getAnexo(id: string) {
    this.fileService.getFile(id);
  }

  openModalNewNoticia(): void {
    this.noticia = new Noticia();
    this.modalNewNoticia = true;
  }

  closeModalNewNoticia() {
    this.modalNewNoticia = false;
    this.noticiaForm.reset();
    this.submittedNoticia = false;
  }

  guardarModalNoticia(): void {
    this.submittedNoticia = true;
    this.noticiaForm.markAllAsTouched();
    if (this.noticiaForm.valid) {
      if (!this.noticia._id) {
        this.noticiaService.addNoticia(this.noticia).then(data => {
          this.closeModalNewNoticia();
          this.getNoticias();
          this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Notícia adicionada com sucesso!' });

        }).catch(error => {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: error.message });
        }).finally(() => this.submittedNoticia = false);
      } else {
        this.noticiaService.updateNoticia(this.noticia).then(data => {
          this.closeModalNewNoticia();
          this.getNoticias();
          this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Notícia atualizada com sucesso!' });

        }).catch(error => {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: error.message });
        }).finally(() => this.submittedNoticia = false);
      }
    }
  }

  handleFileInput(event): void {
    if (event.target.files.item(0) && this.noticia.files?.length < 2)
      this.noticia.files.push(event.target.files.item(0));
    if (event.target.files.item(1) && this.noticia.files?.length < 2)
      this.noticia.files.push(event.target.files.item(1));

    event.target.value = null;

  }

  removeFile(index) {
    this.noticia.files.splice(index, 1)
    this.fileUpload.nativeElement.files = null;
  }

  handleFileInputPreVisulizar(event): void {
    this.noticia.filePreVisualizar = event.target.files.item(0);
    event.target.value = null;

  }

  removeFilePrevisualizar() {
    this.noticia.filePreVisualizar = null;
    this.fileUploadPreVisualizar.nativeElement.files = null;
  }

  openModalNoticia(noticia) {
    this.noticiaSelecionada = noticia;
    this.modalNoticia = true;

  }
  closeModalNoticia() {
    this.modalNoticia = false;
    this.noticiaSelecionada = new Noticia();
  }
}
