import { Injectable } from '@angular/core';
import { OfertaFormacao, OfertaFormacaoCandidatura } from '../modules/red-emprega/models/oferta-formacao';
import { APIClientService } from './apiclient.service';

const OFERTA_FORMACAO_API = 'api/oferta-formacao';

@Injectable({
    providedIn: 'root'
})
export class OfertaFormacaoService {
    constructor(private apiClient: APIClientService) { }

    getOfertasFormacaoPublic(): Promise<any> {
        return this.apiClient.get(OFERTA_FORMACAO_API + '/public');
    }

    getOfertasFormacao(): Promise<any> {
        return this.apiClient.get(OFERTA_FORMACAO_API);
    }

    getOfertasFormacaoExpiradas(): Promise<any> {
        return this.apiClient.get(OFERTA_FORMACAO_API + '/expirado');
    }

    getOfertasFormacaoArquivadas(): Promise<any> {
        return this.apiClient.get(OFERTA_FORMACAO_API + '/arquivado');
    }

    addOfertaFormacao(oferta: OfertaFormacao): Promise<any> {
        const formData = new FormData();
        Object.keys(oferta).forEach(key => {
            if (key != 'files' && oferta[key]) formData.append(key, oferta[key])
        });
        for (let file of oferta.files) {
            formData.append('files', file);
        }
        return this.apiClient.post(OFERTA_FORMACAO_API, formData, {}, true);
    }

    updateOfertaFormacao(oferta: OfertaFormacao): Promise<any> {
        const formData = new FormData();
        Object.keys(oferta).forEach(key => {
            if (key != 'files' && oferta[key]) formData.append(key, oferta[key])
        });
        for (let file of oferta.files) {
            formData.append('files', file);
        }
        return this.apiClient.put(OFERTA_FORMACAO_API, formData, {}, true);
    }

    renovaOfertaFormacao(oferta: OfertaFormacao): Promise<any> {
        return this.apiClient.put(OFERTA_FORMACAO_API + '/expirado', {
            _id: oferta._id,
            dataLimite: oferta.dataLimite
        });
    }

    desarquivaOfertaFormacao(oferta: OfertaFormacao): Promise<any> {
        return this.apiClient.put(OFERTA_FORMACAO_API + '/arquivado', {
            _id: oferta._id,
            dataLimite: oferta.dataLimite
        });
    }

    removeOfertaFormacao(oferta: OfertaFormacao): Promise<any> {
        return this.apiClient.delete(OFERTA_FORMACAO_API, { id: oferta._id });
    }

    removeOfertaFormacaoHard(oferta: OfertaFormacao): Promise<any> {
        return this.apiClient.delete(OFERTA_FORMACAO_API + '/hard', { id: oferta._id });
    }

    submitcandidatura(candidatura: OfertaFormacaoCandidatura): Promise<any> {
        return this.apiClient.post(OFERTA_FORMACAO_API + '/candidatura', candidatura);
    }
}
