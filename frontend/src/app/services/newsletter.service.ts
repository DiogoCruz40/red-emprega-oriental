import { Injectable } from '@angular/core';
import { APIClientService } from './apiclient.service';
import { newsletter, unsubscribe } from '../modules/red-emprega/models/newsletter';

const NEWSLETTER_API = 'api/newsletter';

const UNSUBSCRIBE_API = 'api/unsubscribe';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {

  constructor(private apiClient: APIClientService) { }

  submitemail(newsletter:newsletter): Promise<any> {
    return this.apiClient.post(NEWSLETTER_API, newsletter);
  
  }
  
  submitunsubscribe(unsubscribe:unsubscribe): Promise<any>
  {
    return this.apiClient.post(UNSUBSCRIBE_API, unsubscribe);
  }

}
