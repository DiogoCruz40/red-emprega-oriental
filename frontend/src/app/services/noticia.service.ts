import { Injectable } from '@angular/core';
import { Noticia } from '../modules/red-emprega/models/noticia';
import { APIClientService } from './apiclient.service';

const NOTICIA_API = 'api/noticia';

@Injectable({
    providedIn: 'root'
})
export class NoticiaService {
    constructor(private apiClient: APIClientService) { }

    getNoticiasPublic(page): Promise<any> {
        return this.apiClient.get(NOTICIA_API + '/public', { page });
    }

    getNoticias(): Promise<Noticia[]> {
        return this.apiClient.get(NOTICIA_API);
    }

    getNoticiasArquivadas(): Promise<Noticia[]> {
        return this.apiClient.get(NOTICIA_API + '/arquivado');
    }

    addNoticia(noticia: Noticia): Promise<any> {
        const formData = new FormData();
        Object.keys(noticia).forEach(key => {
            if (key != 'files' && key != 'filePreVisualizar') formData.append(key, noticia[key])
        });
        for (let file of noticia.files) {
            formData.append('anexos', file);
        }
        if (noticia.filePreVisualizar)
            formData.append('preVisualizar', noticia.filePreVisualizar)
        return this.apiClient.post(NOTICIA_API, formData, {}, true);
    }

    updateNoticia(noticia: Noticia): Promise<any> {
        const formData = new FormData();
        Object.keys(noticia).forEach(key => {
            if (key != 'files' && key != 'filePreVisualizar') formData.append(key, noticia[key])
        });
        if (noticia.files) {
            for (let file of noticia.files) {
                formData.append('anexos', file);
            }
        }
        if (noticia.filePreVisualizar)
            formData.append('preVisualizar', noticia.filePreVisualizar)
        return this.apiClient.put(NOTICIA_API, formData, {}, true);
    }

    desarquivaNoticia(noticia: Noticia): Promise<any> {
        return this.apiClient.put(NOTICIA_API + '/arquivado', noticia);
    }

    removeNoticia(noticia: Noticia): Promise<any> {
        return this.apiClient.delete(NOTICIA_API, { id: noticia._id });
    }

    removeNoticiaHard(noticia: Noticia): Promise<any> {
        return this.apiClient.delete(NOTICIA_API + '/hard', { id: noticia._id });
    }
}