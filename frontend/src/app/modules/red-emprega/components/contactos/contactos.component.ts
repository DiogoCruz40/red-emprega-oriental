import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContactosService } from 'src/app/services/contactos.service';
import { MessageService } from 'primeng/api';
import { Contacto } from '../../models/contacto-form';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 're-contactos',
  templateUrl: './contactos.component.html',
  styleUrls: ['./contactos.component.scss'],
})
export class ContactosComponent implements OnInit, OnDestroy {

  isContactos = false;
  isSuccessful = false;
  errorMessage = '';
  contactosForm: FormGroup;
  newContacto: Contacto = new Contacto();
  submitted = false;
  mensagemContacto = '';
  recaptcha;
  antiSpamBot = '';
  public ready: Observable<ReCaptchaV2.ReCaptcha>;
  redeMarvilaList = [];
  redeOlivaisList = [];
  redeParqueDasNacoesList = [];
  rede
  constructor(
    private router: Router,
    private contactoservice: ContactosService,
    private messageService: MessageService) {

    let readySubject = new BehaviorSubject<ReCaptchaV2.ReCaptcha>(grecaptcha);
    this.ready = readySubject.asObservable();

    this.isContactos = this.router.url.includes('contactos');
  }

  ngOnInit(): void {

    this.redeMarvilaList = [
      {
        nome: 'AGIR XXI – Associação para a Inclusão Social',
        src: '../../assets/img/logos/AGIRXXI.png',
        link: 'https://www.agirxxi.pt/',
        endereco: 'Rua do Vale Formoso de Cima, nº47, 1950-265 Lisboa',
        email: ['info@agirxxi.pt', 'gip@agirxxi.pt'],
        contacto: 'Tel: +351 218 380 003\nTelm: +351 927 550 188'
      },
      {
        nome: 'AMI – Assistência Médica Internacional',
        src: '../../assets/img/logos/AMI.png',
        link: 'https://ami.org.pt/',
        endereco: 'Rua José do Patrocínio, nº49 1959-003 Lisboa',
        email: ['fundacao.ami@ami.org.pt'],
        contacto: 'Tel: +351 218 362 100'
      },
      {
        nome: 'Aguinenso - Associação Guineense de Solidariedade Social',
        src: '../../assets/img/logos/AGSS.png',
        link: 'https://agss.pt/',
        endereco: 'Av. João Paulo II, Lote 528, 2A, Bairro do Condado, 1950-430 Lisboa',
        email: ['gip.aguinenso@gmail.com'],
        contacto: 'Tel: +351 218 371 022\nTelm: +351 926 614 401'
      },
      {
        nome: 'CAIS – Associação de Solidariedade Social',
        src: '../../assets/img/logos/CAIS.png',
        link: 'https://www.cais.pt/',
        endereco: 'Rua do Vale Formoso de Cima, 49 - 55, 1950-265 Lisboa',
        email: ['cais@cais.pt'],
        contacto: 'Tel: +351 218 369 000'
      },
      {
        nome: 'Cerci Lisboa',
        src: '../../assets/img/logos/CERCI_LISBOA.png',
        link: 'https://www.cercilisboa.org.pt/',
        endereco: ' Av.ª Avelino Teixeira da Mota, Lote E, 1950-033 Lisboa',
        email: ['geral@cercilosboa.org.pt'],
        contacto: 'Tel: +351 218 391 700'
      },
      {
        nome: 'CNAD – Cooperativa Nacional de Apoio a Deficientes',
        src: '../../assets/img/logos/CNAD.png',
        link: 'https://www.facebook.com/cnad.sede',
        endereco: 'Praça Dr. Fernando Amado 566E, 1950-091 Lisboa',
        email: ['cnad.sede@gmail.com'],
        contacto: 'Telm: +351 218 595 332'
      },
      {
        nome: 'CPR – Conselho Português para os Refugiados',
        src: '../../assets/img/logos/CPR.png',
        link: 'https://cpr.pt/',
        endereco: 'Quinta do Pombeiro, Casa Senhorial Norte Azinhaga do Pombeiro, s/n, 1900-793 Lisboa',
        email: ['	geral@cpr.pt'],
        contacto: 'Tel: +351 218 314 372'
      },
      {
        nome: 'CRI de Lisboa Oriental Equipa de Tratamento de Xabregas',
        src: '../../assets/img/logos/CRI.png',
        link: '',
        endereco: 'Rua Xabregas, nº62, 1900-440 Lisboa',
        email: ['geral@arslvt.min-saude.pt'],
        contacto: 'Tel: +351 218 610 470'
      },
      {
        nome: 'Delta Cafés',
        src: '../../assets/img/logos/DELTA.png',
        link: 'https://www.deltacafes.pt/',
        endereco: 'Av. Infante D. Henrique, nº151A, 1900-709 Lisboa',
        email: ['lisboa@delta-cafes.pt'],
        contacto: 'Tel: +351 218 624 700'
      },
      {
        nome: 'GEBALIS – Gestão do Arrendamento da Habitação Municipal de Lisboa',
        src: '../../assets/img/logos/GEBALIS.jpg',
        link: 'https://www.gebalis.pt/Paginas/default.aspx',
        endereco: 'Rua Costa Malheiro, Lote B12, 1800-412 Lisboa',
        email: ['  gbl@gebalis.pt'],
        contacto: 'Tel: +351 217 511 000'
      },
      {
        nome: 'Junta de Freguesia de Marvila',
        src: '../../assets/img/logos/MARVILA.png',
        link: 'https://jf-marvila.pt/',
        endereco: 'Avenida Paulo VI, nº60, Lisboa',
        email: ['info@jf-marvila.pt'],
        contacto: 'Tel: +351 218 310 350'
      },
      {
        nome: 'Santa Casa da Misericórdia de Lisboa (UDIP Marvila)',
        src: '../../assets/img/logos/SANTA_CASA.png',
        link: 'https://www.scml.pt/',
        endereco: 'Praça José Queirós, nº1 Piso 3, 1800-237 Lisboa',
        email: ['udip.marvila@scml.pt'],
        contacto: 'Tel: +351 218 554 100'
      },
      {
        nome: 'SPEM – Sociedade Portuguesa de Esclerose Múltipla',
        src: '../../assets/img/logos/SPEM.png',
        link: 'https://spem.pt/',
        endereco: 'Rua Praça David Leandro da Silva, nº25, 1950-064 Lisboa',
        email: ['lisboa-geral@spem.pt'],
        contacto: 'Tel: +351 218 650 480\nTelm: +351 934 386 904'
      },
      {
        nome: 'VENCER – Associação para o Desenvolvimento',
        src: '../../assets/img/logos/VENCER.png',
        link: 'https://www.facebook.com/vencerassociacao/',
        endereco: 'R Pereira Henriques, nº1 Gabinete 11E, 1950-242 Lisboa',
        email: ['associacaovencer@gmail.com'],
        contacto: 'Tel: +351 918 836 332'
      },
      {
        nome: 'SEA – Agência Empreendedores Sociais – Fábrica Empreendedor',
        src: '../../assets/img/logos/SEA.png',
        link: 'http://www.seagency.org/',
        endereco: 'Rua José Alberto Pessoa, Lote E, Loja B, BR Marquês de Abrantes, 1950-379 Lisboa',
        email: ['lisboa@fabricadoempreendedor.pt'],
        contacto: 'Tel: +351 218 371 091\nTelm: +351 966 612 657'
      },
      {
        nome: 'Marvila com o apoio da equipa da RedEmprega Lisboa (APEA, CML, FAK) e IEFP',
        src: '../../assets/img/logos/IEFP.png',
        link: 'https://www.iefp.pt/',
        endereco: 'R. das Picoas, nº14, 1069-003 Lisboa',
        email: ['delegacao.lisboa@iefp.pt'],
        contacto: 'Tel: +351 215 802 000\nTel: +351 215 802 093'
      },
    ];

    this.redeOlivaisList = [
      {
        nome: 'Junta de Freguesia de Olivais',
        src: '../../assets/img/logos/OLIVAIS.png',
        link: 'https://www.jf-olivais.pt/',
        endereco: 'R. General Silva Freire, Lote C, 1849-029 Lisboa',
        email: ['gip.olivais@jf-olivais.pt'],
        contacto: 'Tel: +351 218 533 231'
      },
      {
        nome: 'Santa Casa da Misericórdia de Lisboa (UDIP Oriente)',
        src: '../../assets/img/logos/SANTA_CASA.png',
        link: 'https://www.scml.pt/',
        endereco: 'Praça José Queirós, nº1 Piso 3, 1800-237 Lisboa',
        email: ['udip.oriente@scml.pt'], 
        contacto: 'Tel: +351 218 554 100'
      },
    ]

    this.redeParqueDasNacoesList = [
      {
        nome: 'Junta de Freguesia do Parque das Nações',
        src: '../../assets/img/logos/PARQUE_NACOES.png',
        link: 'https://www.jf-parquedasnacoes.pt/',
        endereco: 'Alameda dos Oceanos, n.º 37 B, 1990-203 Lisboa',
        email: ['atendimento@jf-parquedasnacoes.pt'],
        contacto: 'Tel: +351 211 388 800'
      },
      {
        nome: 'Santa Casa da Misericórdia de Lisboa (UDIP Oriente)',
        src: '../../assets/img/logos/SANTA_CASA.png',
        link: 'https://www.scml.pt/',
        endereco: 'Praça José Queirós, nº1 Piso 3, 1800-237 Lisboa',
        email: ['udip.oriente@scml.pt'], 
        contacto: 'Tel: +351 218 554 100'
      },
    ]

    this.contactosForm = new FormGroup({
      nome: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      assunto: new FormControl(null, Validators.required),
      mensagem: new FormControl(null, Validators.required),
    });

    this.recaptcha = (window as any).grecaptcha;


  }

  ngOnDestroy(): void {
  }

  novocontacto(): void {
    if (this.antiSpamBot)
      return;
    if (this.contactosForm.valid) {

      var loading = document.getElementsByClassName('loading') as HTMLCollectionOf<HTMLElement>;
      loading[0].style.display = 'block';

      this.contactoservice.submitContact(this.newContacto).then(data => {
        this.submitted = false;

        var sucess = document.getElementsByClassName('sent-message') as HTMLCollectionOf<HTMLElement>
        setTimeout(function () {
          loading[0].style.display = 'none';
          sucess[0].style.display = 'flex';
        }, 1500);
        setTimeout(function () {
          sucess[0].style.display = 'none';
        }, 6500);

        this.mensagemContacto = 'A sua mensagem foi enviada. Entraremos em contacto em breve.';
        this.newContacto = new Contacto();
        this.submitted = false;
        this.contactosForm.reset();
      }).catch(error => {
        var erro = document.getElementsByClassName('error-message') as HTMLCollectionOf<HTMLElement>

        setTimeout(function () {
          loading[0].style.display = 'none';
          erro[0].style.display = 'block';
        }, 1500);
        setTimeout(function () {
          erro[0].style.display = 'none';
        }, 6500);

        this.mensagemContacto = 'Houve um problema ao enviar a sua mensagem. Por favor contacto-nos a partir dos contactos disponíveis.';
      })
    }
  }

  enviarMensagem() {
    this.submitted = true;
    if (this.contactosForm.valid) {
      this.recaptcha.execute();
    }
  }

  captchaResponse(response) {

    this.contactoservice.captchaValidation(response).then(
      () => {
        this.novocontacto();
        this.recaptcha.reset();
      }
    ).catch(() => {
      this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Houve um problema ao efectuar o reCAPTCHA. Por favor volte a tentar.' });
    });
  }
}
