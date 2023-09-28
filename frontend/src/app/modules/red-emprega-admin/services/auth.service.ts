import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIClientService } from 'src/app/services/apiclient.service';

const AUTH_API = 'api/auth/';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private apiClient: APIClientService) { }

    login(email: string, password: string): Promise<any> {
        return this.apiClient.post(AUTH_API + 'iniciar-sessao', {
            email,
            password
        });
    }

    register(nome: string, email: string, password: string): Promise<any> {
        return this.apiClient.post(AUTH_API + 'registar', {
            nome,
            email,
            password
        });
    }
    isValid(): boolean {
        return true;
    }
    alterarNome(nome: string): Promise<any> {
        return this.apiClient.put(AUTH_API + 'nome', {
            nome,
        });
    }

    alterarPassword(currentPassword: string, newPassword: string): Promise<any> {
        return this.apiClient.put(AUTH_API + 'password', {
            currentPassword,
            newPassword,
        });
    }
}
