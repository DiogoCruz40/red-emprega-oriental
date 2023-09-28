import { Component, ElementRef, HostBinding, OnInit, Sanitizer, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { FileService } from 'src/app/services/file.service';
import { NoticiaService } from 'src/app/services/noticia.service';
import { OfertaEmpregoService } from 'src/app/services/oferta-emprego.service';
import { Noticia } from '../../models/noticia';
import { OfertaEmprego, OfertaEmpregoCandidatura } from '../../models/oferta-emprego';
import { PoliticaPrivacidadeAsModalComponent } from '../politica-privacidade/politica-privacidade-as-modal/politica-privacidade-as-modal.component';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt-PT';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilsService } from 'src/app/services/utils.service';
registerLocaleData(localePt, 'pt');

@Component({
  selector: 're-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.scss'],
})
export class NoticiasComponent implements OnInit {

  page = 0;
  isSuccessful = false;
  errorMessage = '';
  submitted = false;
  mensagemoferta = '';
  noticiaList: Noticia[] = [];
  noticiaSelecionada: Noticia = new Noticia();
  searchInput = '';
  curriculo: File;
  botaoEnviar = true;
  antiSpamBot = '';
  modaNoticia = false;
  totalPages = 0;

  @ViewChild('politicaPrivacidade') politicaPrivacidadeAsModal: PoliticaPrivacidadeAsModalComponent;
  @ViewChild('fileUpload') fileUpload: ElementRef;
  @HostBinding("style.--var-tamanho") tamanhoAtual: string;
  @ViewChild('myDivResposta', { static: false }) myDivResposta: ElementRef;
  constructor(
    private noticiaService: NoticiaService,
    private sanitizer: DomSanitizer,
    private fileService: FileService,
    private utilsService: UtilsService,
    private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.noticiaService.getNoticiasPublic(this.page).then(noticias => {
      if (noticias && noticias.content) {
        this.noticiaList = noticias.content;
        this.totalPages = noticias.totalPages;
        this.noticiaList.forEach(noticia => {
          if (noticia.preVisualizar?._id) {
            noticia.descricao = this.utilsService.linkify(noticia.descricao)
            this.fileService.getFile(noticia.preVisualizar._id, true).then(
              file => {
                if (file) {
                  var urlCreator = window.URL || window.webkitURL;
                  let objectURL = urlCreator.createObjectURL(file.file);
                  noticia.imgPrevisualizar = this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
                }
              });
          }
          noticia.lerMais = true
        });
      }
    }).catch(error => {
      this.messageService.add({ severity: 'info', summary: 'Erro!', detail: 'Houve um problema ao consultar as notícias. Por favor tente mais tarde.' });
    });
  }

  getAnexo(id: string) {
    this.fileService.getFile(id);
  }

  openTermos(): void {
    this.politicaPrivacidadeAsModal.open();
  }

  openModalNoticia(noticia) {
    this.noticiaSelecionada = noticia;
    this.modaNoticia = true;

  }
  closeModalNoticia() {
    this.modaNoticia = false;
    this.noticiaSelecionada = new Noticia();
  }

  getNextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.noticiaService.getNoticiasPublic(this.page).then(noticias => {
        if (noticias && noticias.content) {
          for (let noticia of noticias.content) {
            noticia.descricao = this.utilsService.linkify(noticia.descricao)
            if (noticia.preVisualizar?._id) {
              this.fileService.getFile(noticia.preVisualizar._id, true).then(
                file => {
                  if (file) {
                    var urlCreator = window.URL || window.webkitURL;
                    let objectURL = urlCreator.createObjectURL(file.file);
                    noticia.imgPrevisualizar = this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
                  }
                });
            }
          };
          this.noticiaList.push(...noticias.content);
        }
      }).catch(error => {
        this.messageService.add({ severity: 'info', summary: 'Erro!', detail: 'Houve um problema ao consultar novas notícias. Por favor tente mais tarde.' });
      });
    }
  }
}
