import { Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { OfertaFormacaoService } from 'src/app/services/oferta-formacao.service.ts';
import { OfertaEmpregoCandidatura } from '../../models/oferta-emprego';
import { OfertaFormacao, OfertaFormacaoCandidatura } from '../../models/oferta-formacao';
import { PoliticaPrivacidadeAsModalComponent } from '../politica-privacidade/politica-privacidade-as-modal/politica-privacidade-as-modal.component';
import { ContactosService } from 'src/app/services/contactos.service';
import { FileService } from 'src/app/services/file.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 're-oferta-formacao',
  templateUrl: './oferta-formacao.component.html',
  styleUrls: ['./oferta-formacao.component.scss'],
})
export class OfertaFormacaoComponent implements OnInit {

  isSuccessful = false;
  errorMessage = '';
  ofertaFormacaoForm: FormGroup;
  newCandidatura: OfertaFormacaoCandidatura = new OfertaFormacaoCandidatura();
  submitted = false;
  mensagemoferta = '';
  ofertaFormacaoList: OfertaFormacao[] = [];
  ofertaSelected: OfertaFormacao = new OfertaFormacao();
  searchInput = '';
  curriculo: File;
  botaoEnviar = true;
  antiSpamBot = '';
  @ViewChild('politicaPrivacidade') politicaPrivacidadeAsModal: PoliticaPrivacidadeAsModalComponent;
  @HostBinding("style.--var-tamanho") tamanhoAtual: string;
  @ViewChild('myDivResposta', { static: false }) myDivResposta: ElementRef;

  constructor(
    private ofertaFormacaoService: OfertaFormacaoService,
    private fileService: FileService,
    private utilsService: UtilsService,
    private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.ofertaFormacaoService.getOfertasFormacaoPublic().then(ofertas => {
      if (ofertas) {
        this.ofertaFormacaoList = ofertas;
        this.ofertaFormacaoList.forEach(oferta => {
          oferta.observacoes = this.utilsService.linkify(oferta.observacoes);
          oferta.lerMais = true
        });
      }
    });

    this.ofertaFormacaoForm = new FormGroup({
      nome: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      telemovel: new FormControl(null, Validators.required),
      termos: new FormControl(null, Validators.requiredTrue),
      cv: new FormControl(null, null),
      observacoes: new FormControl(null, null),
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

  newOferta(oferta: OfertaFormacao): void {
    let existeUmaOfertaAtiva = false;
    for (let ofertaAux of this.ofertaFormacaoList) {
      if (ofertaAux.isCollapsed) {
        ofertaAux.isCollapsed = false;
        existeUmaOfertaAtiva = true;
      }
    }
    if (!existeUmaOfertaAtiva) {
      this.newCandidatura = new OfertaEmpregoCandidatura();
    }
    this.newCandidatura.idOferta = oferta._id;
    oferta.isCollapsed = true;
  }

  openTermos(): void {
    this.politicaPrivacidadeAsModal.open();
  }

  getAnexo(id: string) {
    this.fileService.getFile(id);
  }

  novacandidatura(index): void {
    if (this.antiSpamBot)
      return;
    this.submitted = true;
    this.messageService.clear();
    if (this.ofertaFormacaoForm.valid) {
      this.ofertaFormacaoService.submitcandidatura(this.newCandidatura).then(data => {
        this.ofertaFormacaoList[index].isCollapsed = false;
        this.ofertaFormacaoForm.reset();
        this.botaoEnviar = true;
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'A sua candidatura foi enviada. Entraremos em contacto em breve.', });
        this.newCandidatura = new OfertaEmpregoCandidatura();
        this.ofertaFormacaoList[index].isCollapsed = false;

      }).catch(error => {
        this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Houve um problema ao enviar a sua candidatura. Por favor contacto-nos a partir dos contactos disponíveis.' });

      }).finally(() => this.submitted = false);
    }
  }
}
