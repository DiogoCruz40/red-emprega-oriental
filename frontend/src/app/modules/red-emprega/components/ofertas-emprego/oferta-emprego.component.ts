import { Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { FileService } from 'src/app/services/file.service';
import { OfertaEmpregoService } from 'src/app/services/oferta-emprego.service';
import { UtilsService } from 'src/app/services/utils.service';
import { OfertaEmprego, OfertaEmpregoCandidatura } from '../../models/oferta-emprego';
import { PoliticaPrivacidadeAsModalComponent } from '../politica-privacidade/politica-privacidade-as-modal/politica-privacidade-as-modal.component';

@Component({
  selector: 're-oferta-emprego',
  templateUrl: './oferta-emprego.component.html',
  styleUrls: ['./oferta-emprego.component.scss'],
})
export class OfertaEmpregoComponent implements OnInit {

  isSuccessful = false;
  errorMessage = '';
  ofertasEmpregoForm: FormGroup;
  newCandidatura: OfertaEmpregoCandidatura = new OfertaEmpregoCandidatura();
  submitted = false;
  mensagemoferta = '';
  ofertaEmpregoList: OfertaEmprego[] = [];
  ofertaSelected: OfertaEmprego = new OfertaEmprego();
  searchInput = '';
  curriculo: File;
  botaoEnviar = true;
  antiSpamBot = '';
  @ViewChild('politicaPrivacidade') politicaPrivacidadeAsModal: PoliticaPrivacidadeAsModalComponent;
  @ViewChild('fileUpload') fileUpload: ElementRef;
  constructor(
    private ofertaEmpregoService: OfertaEmpregoService,
    private fileService: FileService,
    private utilsService: UtilsService,
    private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.ofertaEmpregoService.getOfertasEmpregoPublic().then(ofertas => {
      if (ofertas) {
        this.ofertaEmpregoList = ofertas;
        this.ofertaEmpregoList.forEach(oferta => {
          oferta.observacoes = this.utilsService.linkify(oferta.observacoes);
          oferta.lerMais = true
        });
      }
    });

    this.ofertasEmpregoForm = new FormGroup({
      nome: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      telemovel: new FormControl(null, Validators.required),
      termos: new FormControl(null, Validators.requiredTrue),
      cv: new FormControl(null, null),
      observacoes: new FormControl(null, null),
    });
  }

  getAnexo(id: string) {
    this.fileService.getFile(id);
  }

  onLerMais(i) {
    let elem: Element = document.getElementById('myDivResposta' + i)
    this.ofertaEmpregoList[i].tamanho = elem.scrollHeight + 25 + 'px';
    if (!this.ofertaEmpregoList[i].lerMais) {
      this.ofertaEmpregoList[i].tamanho = null;
    }
    this.ofertaEmpregoList[i].lerMais = !this.ofertaEmpregoList[i].lerMais
  }

  newOferta(oferta: OfertaEmprego): void {
    let existeUmaOfertaAtiva = false;
    for (let ofertaAux of this.ofertaEmpregoList) {
      if (ofertaAux.isCollapsed) {
        ofertaAux.isCollapsed = false;
        existeUmaOfertaAtiva = true;
      }
    }
    if (!existeUmaOfertaAtiva) {
      this.newCandidatura = new OfertaEmpregoCandidatura();
    }
    this.submitted = false;
    this.newCandidatura.idOferta = oferta._id;
    oferta.isCollapsed = true;
  }

  openTermos(): void {
    this.politicaPrivacidadeAsModal.open();
  }

  novacandidatura(index): void {
    if (this.antiSpamBot)
      return;
    this.submitted = true;
    this.messageService.clear();
    if (this.ofertasEmpregoForm.valid) {
      if (!this.newCandidatura.cv && this.ofertaEmpregoList[index].curriculo) {
        this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'O currículo é de caráter obrigatório.' });
        return;
      }
      this.ofertaEmpregoService.submitcandidatura(this.newCandidatura).then(data => {
        this.botaoEnviar = true;
        this.ofertaEmpregoList[index].isCollapsed = false;
        this.ofertasEmpregoForm.reset();
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'A sua candidatura foi enviada. Entraremos em contacto em breve.', });
        this.newCandidatura = new OfertaEmpregoCandidatura();
        this.ofertaEmpregoList[index].isCollapsed = false;

      }).catch(error => {
        if (error.message) {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: error.message });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Houve um problema ao enviar a sua candidatura. Por favor contacto-nos a partir dos contactos disponíveis.' });
        }
      }).finally(() => this.submitted = false);
    }
  }

  handleFileInput(event): void {
    this.newCandidatura.cv = event.target.files.item(0);
    event.target.value = null;

  }

  removeFile() {
    this.newCandidatura.cv = null;
    this.fileUpload.nativeElement.files = null;
  }
}
