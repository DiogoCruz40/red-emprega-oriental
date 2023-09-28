import { createHostListener } from '@angular/compiler/src/core';
import { Component, HostListener, OnInit } from '@angular/core';
import { PrimeIcons } from 'primeng/api';
declare let AOS: any;

@Component({
  selector: 're-sobre-nos',
  templateUrl: './sobre-nos.component.html',
  styleUrls: ['./sobre-nos.component.scss'],
})
export class SobreNosComponent implements OnInit {
  alignTimeline = 'alternate';

  redeList: any[] = [];
  quemSomos: any[] = [];
  constructor() {
    this.redeList = [
      { nome: 'AGIR XXI – Associação para a Inclusão Social', src: '../../assets/img/logos/AGIRXXI.png', link: 'https://www.agirxxi.pt/' },
      { nome: 'AMI – Assistência Médica Internacional', src: '../../assets/img/logos/AMI.png', link: 'https://ami.org.pt/' },
      { nome: 'Associação Guineense de Solidariedade Social', src: '../../assets/img/logos/AGSS.png', link: 'https://agss.pt/' },
      { nome: 'CAIS – Associação de Solidariedade Social', src: '../../assets/img/logos/CAIS.png', link: 'https://www.cais.pt/'  },
      { nome: 'Cerci Lisboa', src: '../../assets/img/logos/CERCI_LISBOA.png', link: 'https://www.cercilisboa.org.pt/'  },
      { nome: 'CNAD – Cooperativa Nacional de Apoio a Deficientes', src: '../../assets/img/logos/CNAD.png', link: 'https://www.facebook.com/cnad.sede'  },
      { nome: 'CPR – Conselho Português para os Refugiados', src: '../../assets/img/logos/CPR.png', link: 'https://cpr.pt/'  },
      { nome: 'CRI de Lisboa Oriental Equipa de Tratamento de Xabregas', src: '../../assets/img/logos/CRI.png', link: ''  },
      { nome: 'Delta Cafés', src: '../../assets/img/logos/DELTA.png', link: 'https://www.deltacafes.pt/'  },
      { nome: 'GEBALIS – Gestão do Arrendamento da Habitação Municipal de Lisboa', src: '../../assets/img/logos/GEBALIS.jpg', link: 'https://www.gebalis.pt/Paginas/default.aspx'  },
      { nome: 'Junta de Freguesia de Marvila', src: '../../assets/img/logos/MARVILA.png', link: 'https://jf-marvila.pt/'  },
      { nome: 'Junta de Freguesia de Olivais', src: '../../assets/img/logos/OLIVAIS.png', link: 'https://www.jf-olivais.pt/'  },
      { nome: 'Junta de Freguesia do Parque das Nações', src: '../../assets/img/logos/PARQUE_NACOES.png', link: 'https://www.jf-parquedasnacoes.pt/'  },
      { nome: 'Santa Casa da Misericórdia de Lisboa (UDIP Marvila e UDIP Oriente)', src: '../../assets/img/logos/SANTA_CASA.png', link: 'https://www.scml.pt/'  },
      { nome: 'SPEM – Sociedade Portuguesa de Esclerose Múltipla', src: '../../assets/img/logos/SPEM.png', link: 'https://spem.pt/'  },
      { nome: 'VENCER – Associação para o Desenvolvimento', src: '../../assets/img/logos/VENCER.png', link: 'https://www.facebook.com/vencerassociacao/'  },
      { nome: 'SEA – Agência Empreendedores Sociais – Fábrica Empreendedor', src: '../../assets/img/logos/SEA.png', link: 'http://www.seagency.org/'  },
      { nome: 'Marvila com o apoio da equipa da RedEmprega Lisboa (APEA, CML, FAK) e IEFP', src: '../../assets/img/logos/IEFP.png', link: 'https://www.iefp.pt/'  },
    ];

    this.quemSomos = [
      {
        header: 'Quem somos',
        text: 'Somos um grupo de organizações das freguesias de Marvila, Olivais e Parque das Nações, que trabalham de forma colaborativa na criação de respostas de empregabilidade.',
        icon: PrimeIcons.HOME, color: '#9C27B0',
      },
      {
        header: 'A Nossa Missão',
        text: 'Promover e implementar processos, na área da empregabilidade, numa lógica de desenvolvimento territorial e de forma integrada valorizando pessoas, organizações e redes.',
        icon: PrimeIcons.BRIEFCASE, color: '#673AB7'
      },
      {
        header: 'Áreas/Dimensões de trabalho',
        text: '• Job-Matching – Pessoa certa no trabalho certo \n• Empreendedorismo – Atitude empreendedora \n• Marketing Territorial – Comunicação interna e externa',
        icon: PrimeIcons.ENVELOPE, color: '#FF9800'
      },
      {
        header: 'Território',
        text: '• Freguesia de Marvila\n• Freguesia dos Olivais\n• Freguesia do Parque das Nações',
        icon: PrimeIcons.HOME, color: '#607D8B'
      }
    ];
  }


  ngOnInit(): void {
    if(window.innerWidth < 728)
    {
      this.alignTimeline = 'left';
    }
    else
    {
      this.alignTimeline = 'alternate';
    }
  
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    console.log(window.innerWidth)
    if(window.innerWidth < 728)
    {
      this.alignTimeline = 'left';
    }
    else
    {
      this.alignTimeline = 'alternate';
    }
  }
}

