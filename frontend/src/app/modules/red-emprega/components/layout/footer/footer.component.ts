import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ContactosService } from 'src/app/services/contactos.service';
import { NewsletterService } from 'src/app/services/newsletter.service';
import { newsletter } from '../../../models/newsletter';
import { PoliticaPrivacidadeAsModalComponent } from '../../politica-privacidade/politica-privacidade-as-modal/politica-privacidade-as-modal.component';

@Component({
  selector: 're-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  providers:[],
})
export class FooterComponent implements OnInit {

  constructor(private newsletterservice:NewsletterService,private messageService: MessageService, private contactoservice: ContactosService) { 
    //config.backdrop = 'static';
    //config.keyboard = false;
  }
  newsletter : newsletter = new newsletter();
  newsletterForm: FormGroup;
  submitted = false;
  @ViewChild('politicaPrivacidade') politicaPrivacidadeAsModal: PoliticaPrivacidadeAsModalComponent;
  
  ngOnInit(): void {
    this.newsletterForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      termos: new FormControl(null, Validators.requiredTrue)
    });
  }
  openTermos(): void {
    this.politicaPrivacidadeAsModal.open();
  }
  newEmail(): void {
    if (this.newsletterForm.valid) {
      this.newsletterservice.submitemail(this.newsletter).then(data => {
        this.newsletterForm.reset();
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'O seu email foi adicionado com sucesso ao newsletter.', });
        this.newsletter = new newsletter();

      }).catch(error => {
        this.messageService.add({ severity: 'error', summary: 'Erro!', detail: error.message });

      }).finally(() => this.submitted = false);
    }
  }
}

