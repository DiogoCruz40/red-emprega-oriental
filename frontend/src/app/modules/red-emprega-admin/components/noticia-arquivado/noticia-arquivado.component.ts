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
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 're-noticia-arquivado',
  templateUrl: './noticia-arquivado.component.html',
  styleUrls: ['./noticia-arquivado.component.scss']
})
export class NoticiaArquivadoComponent implements OnInit {
  searchInput = '';
  adminSelected: User;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  noticiaList: Noticia[] = [];
  noticiaForm: FormGroup;
  submittedNoticia = false;
  noticia: Noticia = new Noticia();
  noticiaSelecionada: Noticia = new Noticia();
  modalNoticiaArquivado = false;
  omnipotente = false;
  modalNoticia = false
  @HostBinding("style.--var-tamanho") tamanhoAtual: string;
  @ViewChild('myDivResposta', { static: false }) myDivResposta: ElementRef;

  constructor(
    private messageService: MessageService,
    private noticiaService: NoticiaService,
    private fileService: FileService,
    private sanitizer: DomSanitizer,
    private tokenStorageService: TokenStorageService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {

    this.noticiaForm = new FormGroup({
      titulo: new FormControl(null, Validators.required),
      descricao: new FormControl(null, Validators.required),
    });
    this.omnipotente = this.tokenStorageService.getUser().omnipotente;

    this.getNoticiasArquivadas()
  }

  getNoticiasArquivadas() {
    this.noticiaService.getNoticiasArquivadas().then(data => {
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

  closeModalOfertaEmprego(): void {
    this.modalNoticiaArquivado = false;
  }

  clickDesarquivar(noticia: Noticia) {
    this.confirmationService.confirm({
      header: 'Desarquivar Notícia',
      message: 'Confirma que pretende desarquivar a notícia <strong>' + noticia.titulo + '</strong> ?',
      acceptLabel: 'Confirmo',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.noticiaService.desarquivaNoticia(noticia).then(data => {
          this.getNoticiasArquivadas();
          this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Notícia deesarquivada com sucesso!' });

        }).catch(error => {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: error.message });
        });
      }
    });

  }

  getAnexo(id: string) {
    this.fileService.getFile(id);
  }

  clickEliminar(noticia: Noticia) {
    this.confirmationService.confirm({
      header: 'Eliminar Permanentemente',
      message: 'Confirma que pretende eliminar permanentemente a notícia <strong>' + noticia.titulo + '</strong> ?',
      acceptLabel: 'Confirmo',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.noticiaService.removeNoticiaHard(noticia).then(data => {
          this.getNoticiasArquivadas();
          this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Notícia eliminada permanentemente com sucesso!' });

        }).catch(error => {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: error.message });
        });
      }
    });

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
