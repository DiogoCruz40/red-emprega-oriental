import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../models/User';
import { AuthService } from '../../services/auth.service';
import { GestaoAdminsService } from '../../services/gestao-admins.service';

@Component({
  selector: 're-manage-admins',
  templateUrl: './manage-admins.component.html',
  styleUrls: ['./manage-admins.component.scss']
})
export class ManageAdminsComponent implements OnInit {
  form: any = {
    username: null,
    email: null,
    password: null
  };
  adminSelected: User;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  adminsList: User[] = [];
  adminForm: FormGroup;
  submittedAdmin = false;
  newUser: User = new User();
  modalNewAdmin = false;
  @ViewChild('modalAdmin') modalAdmin: TemplateRef<any>;


  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private gestaoAdminsService: GestaoAdminsService,
    private confirmationService: ConfirmationService) {

  }

  ngOnInit(): void {

    this.adminForm = new FormGroup({
      nome: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    });

    this.gestaoAdminsService.getAdmins().then(data => {
      this.adminsList = data;
    }).catch(error => this.messageService.add({ severity: 'error', summary: 'Erro!', detail: error.message }));
  }

  clickEditar(user: any) {
    this.confirmationService.confirm({
      header: 'Reset Password',
      message: 'Queres enviar uma nova password?',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.gestaoAdminsService.alterapassAdmin(user).then(data => {
          this.gestaoAdminsService.getAdmins().then(data => {
            this.adminsList = data;
          }).catch(error => this.messageService.add({ severity: 'error', summary: 'Erro!', detail: error.message }))

          this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Nova password enviada com sucesso!' });

        }).catch(error => {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: error.message });
        });
      }
    });
  }

  clickEliminar(user: any) {
    this.confirmationService.confirm({
      header: 'Eliminar Administrador',
      message: 'Confirmas a eliminação?',
      acceptLabel: 'Confirmo',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.gestaoAdminsService.removeAdmin(user).then(data => {
          this.gestaoAdminsService.getAdmins().then(data => {
            this.adminsList = data;
          }).catch(error => {
            this.messageService.add({ severity: 'error', summary: 'Erro!', detail: error.message });
          });
          this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Administrador eliminado com sucesso!' });

        }).catch(error => {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: error.message });
        });
      }
    });
  }

  openModalAddAdmin() {
    this.modalNewAdmin = true;

  }

  closeModalAdmin() {
    this.modalNewAdmin = false;
    this.adminForm.reset();
    this.submittedAdmin = false;

  }
  guardarModalAdmin(): void {
    this.submittedAdmin = true;
    if (this.adminForm.valid) {
      this.gestaoAdminsService.addAdmin(this.newUser).then(data => {
        this.gestaoAdminsService.getAdmins().then(data => {
          this.adminsList = data;
        }).catch(error => {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: error.message });
        });
        this.closeModalAdmin();
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Administrador adicionado com sucesso!' });

      }).catch(error => {
        this.messageService.add({ severity: 'error', summary: 'Erro!', detail: error.message });
      }).finally(() => this.submittedAdmin = false);
    }
  }
  onSubmit(): void {
    const { username, email, password } = this.form;

    this.authService.register(username, email, password)
      .then(
        data => {
          this.isSuccessful = true;
          this.isSignUpFailed = false;
        },
        err => {
          this.errorMessage = err.message;
          this.isSignUpFailed = true;
        }
      );
  }
}
