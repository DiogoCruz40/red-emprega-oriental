import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsletterService } from 'src/app/services/newsletter.service';
import { newsletter, unsubscribe } from '../../models/newsletter';

@Component({
  selector: 'app-unsubscribe',
  templateUrl: './unsubscribe.component.html',
  styleUrls: ['./unsubscribe.component.scss']
})
export class UnsubscribeComponent implements OnInit {

  constructor(private route: ActivatedRoute,private newsletterservice:NewsletterService) { }

  unsubscribe = new unsubscribe();
  unsub = false;

  ngOnInit(): void {
    const firstParam: string = this.route.snapshot.queryParamMap.get('hash');

    this.unsubscribe.hash = firstParam;

    this.newsletterservice.submitunsubscribe(this.unsubscribe).then(data => {
      
      this.unsub = true;
      this.unsubscribe = new unsubscribe();

    }).catch(error => {
      console.log(error.message.message);
  });

}

}
