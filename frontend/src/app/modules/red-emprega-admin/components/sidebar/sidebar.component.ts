import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { User } from '../../models/User';
import { TokenStorageService } from '../../services/token-storage.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 're-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  isLoggedIn = false;
  isAdminOmni = false;
  nome?: string;
  items: MenuItem[];
  constructor(private breakpointObserver: BreakpointObserver, private tokenStorageService: TokenStorageService) {
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

    this.items = [
      {
        label: 'Ofertas de Emprego',
        items: [{
          label: 'Lista',
          icon: 'pi pi-list',
          routerLink: './admin/oferta-emprego'
        },
        {
          label: 'Expirado',
          icon: 'pi pi-calendar-times',
          routerLink: './admin/oferta-emprego-expirado'
        },
        {
          label: 'Arquivado',
          icon: 'pi pi-briefcase',
          routerLink: './admin/oferta-emprego-arquivado'
        }
        ]
      },
      {
        label: 'Ofertas de Formação',
        items: [{
          label: 'Lista',
          icon: 'pi pi-list',
          routerLink: './admin/oferta-formacao'
        },
        {
          label: 'Expirado',
          icon: 'pi pi-calendar-times',
          routerLink: './admin/oferta-formacao-expirado'
        },
        {
          label: 'Arquivado',
          icon: 'pi pi-briefcase',
          routerLink: './admin/oferta-formacao-arquivado'
        }
        ]
      },
      {
        label: 'Notícias',
        items: [{
          label: 'Lista',
          icon: 'pi pi-list',
          routerLink: './admin/noticia'
        },
        {
          label: 'Arquivado',
          icon: 'pi pi-briefcase',
          routerLink: './admin/noticia-arquivado'
        }
        ]
      },

    ];
  }

  setUser(user: User): void {
    this.isAdminOmni = user ? user.omnipotente : false;
    this.nome = user?.nome;
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
