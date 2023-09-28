import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  currentUser: any;

  constructor(private token: TokenStorageService) {
    this.token.userBS.subscribe({
      next: userBS => {
        this.currentUser = userBS;
      },
      error: error => {
        console.log(error);
      }
    });
  }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
  }
}

