import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 're-politica-privacidade-as-modal',
  templateUrl: './politica-privacidade-as-modal.component.html',
  styleUrls: ['./politica-privacidade-as-modal.component.scss'],
})
export class PoliticaPrivacidadeAsModalComponent implements OnInit {
  constructor(private modalService: NgbModal) { }

  @ViewChild('conteudo') myModal : any;

  open(): void {
    this.modalService.open(this.myModal, { size: 'md' });
  }

  ngOnInit(): void { }

}
