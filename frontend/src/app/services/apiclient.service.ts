import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from '../modules/red-emprega-admin/services/token-storage.service';

export class Message {
    message: string;
    code: string;
    title: string;
    errorType: string;
    httpCode: number;

    constructor(message: string) {
        this.message = message;
    }
}

@Injectable()
export class APIClientService {

    constructor(protected http: HttpClient, private tokenStorageService: TokenStorageService) { }

    private tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    get(url: any, params?: any, isFile?: boolean): Promise<any> {
        const httpOptions: any = {};
        // put in header token auth
        httpOptions.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        // put in http options responsetype if is file or not
        httpOptions.responseType = isFile ? 'blob' : 'json';
        httpOptions.observe = 'response' as 'response';
        // put in http options params if exists
        if (params) { httpOptions.params = params; }
        return this.http
            .get(environment.backendUrl + url, httpOptions)
            .toPromise()
            .then(data => this.handleSuccess(data, isFile))
            .catch(this.handleError.bind(this));
    }

    post(url: string, body: any, params?: any, sendFile?: boolean, receiveFile?: boolean): Promise<any> {
        const httpOptions: any = {};
        // put in header token auth
        httpOptions.headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        if (sendFile) { httpOptions.headers = httpOptions.headers.delete('Content-Type'); }
        // put in http options responsetype if is file or not
        httpOptions.responseType = receiveFile ? 'blob' : 'json';
        httpOptions.observe = 'response' as 'response';
        if (params) { httpOptions.params = params; }
        try {
            body = body ? JSON.parse(body) : JSON.parse('{}');
        } catch (e) { }

        return this.http
            .post(environment.backendUrl + url, body, httpOptions)
            .toPromise()
            .then(this.handleSuccess.bind([this, receiveFile]))
            .catch(this.handleError.bind(this));
    }

    put(url: string, body?: any, params?: any, sendFile?: boolean, receiveFile?: boolean): Promise<any> {
        const httpOptions: any = {};
        // put in header token auth
        httpOptions.headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        if (sendFile) { httpOptions.headers = httpOptions.headers.delete('Content-Type'); }
        // put in http options responsetype if is file or not
        httpOptions.responseType = receiveFile ? 'blob' : 'json';
        if (params) { httpOptions.params = params; }
        httpOptions.observe = 'response' as 'response';
        try {
            body = body ? JSON.parse(body) : JSON.parse('{}');
        } catch (e) { }

        return this.http
            .put(environment.backendUrl + url, body, httpOptions)
            .toPromise()
            .then(this.handleSuccess.bind([this, receiveFile]))
            .catch(this.handleError.bind(this));
    }

    delete(url: string, params?: any): Promise<any> {
        const httpOptions: any = {};
        // put in header token auth
        httpOptions.headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        httpOptions.observe = 'response' as 'response';
        // put in http options params if exists
        if (params) { httpOptions.params = params; }
        return this.http
            .delete(environment.backendUrl + url, httpOptions)
            .toPromise()
            .then(this.handleSuccess.bind([this, false]))
            .catch(this.handleError);
    }


    private handleSuccess(data: any, receiveFile?): Promise<any> {
        if (!data || data.body == null) {
            return Promise.resolve(null);
        }

        if (receiveFile) {
            var contentDisposition = data.headers.get('Content-Disposition');
            var filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();
            var dataToSend = {
                file: null,
                fileName: null,
            };
            dataToSend.file = data.body
            dataToSend.fileName = filename
            return Promise.resolve(dataToSend);
        }
        return Promise.resolve(data.body);
    }

    private handleError(data: any): Promise<any> {
        if (!data) {
            return Promise.resolve(null);
        }
        let message: Message;
        if (data.status === 403) {
            message = {
                message: 'Sem permissões para realizar o pedido. Contacte o administrador do sistema.',
                code: 'SEM_PERMISSOES',
                title: 'Atenção',
                errorType: 'info',
                httpCode: data.status
            };
            return Promise.reject(message);
        } else if (data.status === 401) {
            this.tokenStorageService.signOut();
            return Promise.resolve(null);
        } else if (data.status === 502) {
            message = {
                message: 'Serviço indisponível, tente mais tarde.',
                code: 'BAD_GATEAWAY',
                title: 'Atenção',
                errorType: 'warning',
                httpCode: data.status
            };
            return Promise.reject(message);
        } else {
            try {
                if (data.error instanceof ProgressEvent) {
                    message = {
                        message: 'Serviço indisponível, tente mais tarde.',
                        code: 'BAD_GATEAWAY',
                        title: 'Atenção',
                        errorType: 'warning',
                        httpCode: data.status
                    };
                    return Promise.reject(message);
                }
                message = new Message(data.error);
                message.httpCode = data.status;
                return Promise.reject(message);
            } catch (e) {
                try {
                    return Promise.reject(message);
                } catch (e) {
                    try {
                        const errorMsgMultiple: Message = new Message(data.error);
                        return Promise.reject(errorMsgMultiple);
                    } catch (e) {
                        console.log('An error occurred', data);
                        try {
                            return Promise.reject(data.error);
                        } catch (e) {
                            return Promise.reject(message);
                        }
                    }
                }
            }
        }
    }


}