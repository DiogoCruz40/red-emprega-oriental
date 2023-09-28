import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIClientService } from 'src/app/services/apiclient.service';
import { User } from '../models/User';



const GESTAO_ADMIN_API = 'api/gestao-admins';

@Injectable({
    providedIn: 'root'
})
export class GestaoAdminsService {
    constructor(private apiClient: APIClientService) { }

    getAdmins(): Promise<any> {
        return this.apiClient.get(GESTAO_ADMIN_API);
    }

    addAdmin(user: User): Promise<any> {
        return this.apiClient.post(GESTAO_ADMIN_API, user);

    }

    removeAdmin(user: User): Promise<any> {

        let params = new HttpParams();
        params = params.append('id', user._id);
        return this.apiClient.delete(GESTAO_ADMIN_API, params);
    }

    alterapassAdmin(user: User): Promise<any> {
        let params = new HttpParams();
        params = params.append('id', user._id);
        return this.apiClient.put(GESTAO_ADMIN_API, {},params);
    }
}
