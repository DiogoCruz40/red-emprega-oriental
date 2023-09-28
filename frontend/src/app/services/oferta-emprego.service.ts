import { Injectable } from '@angular/core';
import { OfertaEmprego, OfertaEmpregoCandidatura } from '../modules/red-emprega/models/oferta-emprego';
import { APIClientService } from './apiclient.service';

const OFERTA_EMPREGO_API = 'api/oferta-emprego';

@Injectable({
    providedIn: 'root'
})
export class OfertaEmpregoService {
    constructor(private apiClient: APIClientService) { }

    getOfertasEmpregoPublic(): Promise<any> {
        return this.apiClient.get(OFERTA_EMPREGO_API + '/public');
    }

    getOfertasEmprego(): Promise<any> {
        return this.apiClient.get(OFERTA_EMPREGO_API);
    }

    getOfertasEmpregoExpirado(): Promise<any> {
        return this.apiClient.get(OFERTA_EMPREGO_API + '/expirado');
    }

    getOfertasEmpregoArquivadas(): Promise<any> {
        return this.apiClient.get(OFERTA_EMPREGO_API + '/arquivado');
    }

    addOfertaEmprego(oferta: OfertaEmprego): Promise<any> {
        const formData = new FormData();
        Object.keys(oferta).forEach(key => {
            if (key != 'files' && oferta[key]) formData.append(key, oferta[key])
        });
        for (let file of oferta.files) {
            formData.append('files', file);
        }
        return this.apiClient.post(OFERTA_EMPREGO_API, formData, {}, true);
    }

    updateOfertaEmprego(oferta: OfertaEmprego): Promise<any> {
        const formData = new FormData();
        Object.keys(oferta).forEach(key => {
            if (key != 'files' && oferta[key]) formData.append(key, oferta[key])
        });
        for (let file of oferta.files) {
            formData.append('files', file);
        }
        return this.apiClient.put(OFERTA_EMPREGO_API, formData, {}, true);
    }

    renovaOfertaEmprego(oferta: OfertaEmprego): Promise<any> {
        return this.apiClient.put(OFERTA_EMPREGO_API + '/expirado', {
            _id: oferta._id,
            dataLimite: oferta.dataLimite
        });
    }

    desarquivaOfertaEmprego(oferta: OfertaEmprego): Promise<any> {
        return this.apiClient.put(OFERTA_EMPREGO_API + '/arquivado', {
            _id: oferta._id,
            dataLimite: oferta.dataLimite
        });
    }

    removeOfertaEmprego(oferta: OfertaEmprego): Promise<any> {
        return this.apiClient.delete(OFERTA_EMPREGO_API, { id: oferta._id });
    }

    removeOfertaEmpregoHard(oferta: OfertaEmprego): Promise<any> {
        return this.apiClient.delete(OFERTA_EMPREGO_API + '/hard', { id: oferta._id });
    }
    submitcandidatura(candidatura: OfertaEmpregoCandidatura): Promise<any> {
        const formData = new FormData();
        Object.keys(candidatura).forEach(key => {
            if (key != 'cv') formData.append(key, candidatura[key])
        });
        formData.append('cv', candidatura.cv)
        return this.apiClient.post(OFERTA_EMPREGO_API + '/candidatura', formData, {}, true);
    }
}
