import { Component, OnInit } from '@angular/core';
import { User } from './models/User';
import { TokenStorageService } from './services/token-storage.service';

@Component({
  selector: 're-red-emprega-admin',
  templateUrl: './red-emprega-admin.component.html',
  styleUrls: ['./red-emprega-admin.component.css']
})
export class RedEmpregaAdminComponent implements OnInit {

  isLoggedIn = false;
  isAdminOmni = false;
  nome?: string;

  constructor(private tokenStorageService: TokenStorageService) {
    this.tokenStorageService.userBS.subscribe({
      next: userBS => {
        this.setUser(userBS);
      },
      error: error => {
        console.log(error);
      }
    });
  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      this.setUser(this.tokenStorageService.getUser());
    }


  }

  setUser(user: User): void {
  
    this.isAdminOmni = user ? user.omnipotente : false;
    this.nome = user?.nome;
  }


}
