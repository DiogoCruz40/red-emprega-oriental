import { Injectable } from '@angular/core';
import { Contacto } from '../modules/red-emprega/models/contacto-form';
import { APIClientService } from './apiclient.service';

const Contactos_API = 'api/contactos';

@Injectable({
  providedIn: 'root'
})
export class ContactosService {

  constructor(private apiClient: APIClientService) { }

  submitContact(contacto: Contacto): Promise<any> {
    return this.apiClient.post(Contactos_API, contacto);
  }
  captchaValidation(response: string) {
    return this.apiClient.post('api/captcha', JSON.stringify({ response: response }));
  }
}