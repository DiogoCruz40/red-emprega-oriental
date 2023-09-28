import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { AlteracaoNomeEnum } from '../../models/AlteracaoNomeEnum';
import { AuthService } from '../../services/auth.service';
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 're-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  currentUser: any;
  nomeAlterar: string;
  palavraPasse: string;
  alteracaoModal: AlteracaoNomeEnum;
  alteracaoNomeEnum = AlteracaoNomeEnum;
  tituloModal: string;
  submitted = false;
  nomeForm: FormGroup;
  passwordForm: FormGroup;
  isSubmit = false;
  modalNome = false;
  modalPassword = false;

  constructor(
    private tokenStorageService: TokenStorageService,
    private authService: AuthService,
    private messageService: MessageService,
  ) {
    this.tokenStorageService.userBS.subscribe({
      next: userBS => {
        this.currentUser = userBS;
      },
      error: error => {
        console.log(error);
      }
    });
  }

  ngOnInit(): void {
    this.currentUser = this.tokenStorageService.getUser();

    this.nomeForm = new FormGroup({
      nome: new FormControl(null, Validators.required),
    }
    );
    this.passwordForm = new FormGroup({
      currentPassword: new FormControl(null, Validators.required),
      newPassword: new FormControl(null, [Validators.required, Validators.pattern('(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@$!#^~%*?&,.<>"\'\\;:\{\\\}\\\[\\\]\\\|\\\+\\\-\\\=\\\_\\\)\\\(\\\)\\\`\\\/\\\\\\]])[A-Za-z0-9\d$@].{7,}')]),
      confirmNewPassword: new FormControl(null, Validators.required),
    },
      this.matchingPasswords,
    );
  }

  openModal(alteracao: AlteracaoNomeEnum): void {
    this.alteracaoModal = alteracao;

    if (this.alteracaoModal === AlteracaoNomeEnum.NOME) {
      this.modalNome = true;
    }
    else {
      this.modalPassword = true
    }

  }

  private matchingPasswords(c: AbstractControl): ValidationErrors | null {
    const newPassword = c.get(['newPassword']);
    const confirmNewPassword = c.get(['confirmNewPassword']);

    if (newPassword.value !== confirmNewPassword.value) {
      return { confirmedValidator: true };
    }
    return null;
  }

  get password(): AbstractControl { return this.passwordForm.get('password'); }
  get confirm_password(): AbstractControl { return this.passwordForm.get('confirm_password'); }


  guardarNome(): void {
    this.submitted = true;
    if (this.nomeForm.invalid) {
      return;
    }
    this.authService.alterarNome(this.nomeAlterar).then(data => {
      this.tokenStorageService.saveUser(data);
      this.closeModal();
      this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Nome alterado com sucesso!' });
      this.submitted = false;
    }).catch(error => this.messageService.add({ severity: 'error', summary: 'Erro!', detail: error.message }));
  }

  closeModal(): void {
    this.nomeAlterar = '';
    this.modalNome = false;
    this.modalPassword = false;
    this.submitted = false;
    this.nomeForm.reset();
    this.passwordForm.reset();
  }

  guardarPassword(): void {
    this.submitted = true;
    if (this.passwordForm.valid) {
      this.authService.alterarPassword(this.passwordForm.value.currentPassword, this.passwordForm.value.newPassword).then(data => {
        this.closeModal();
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Palavra-passe alterada com sucesso!' });

      }).catch(error => {
        this.messageService.add({ severity: 'error', summary: 'Erro!', detail: error.message });
      });
    }
  }
}
