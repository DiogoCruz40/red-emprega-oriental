import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 're-search-box',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})

export class SearchComponent {

    @Input() placeholder: string;
    @Input() idComponente = '';
    @Input() wordToSearch: string;
    @Input() disabled = false;
    @Input() style = '';
    @Output() update = new EventEmitter();

    constructor() {
    }

    keyEnterUpdate(keyEvent?: any): void {
        if (this.wordToSearch === undefined) {
            return;
        }
        this.wordToSearch = this.wordToSearch.replace(/^\s+/g, '');
        this.wordToSearch = this.wordToSearch.replace('  ', ' ');
        if (keyEvent === undefined || (keyEvent.key === 'Backspace' && this.wordToSearch.split(' ').join('') === '') ||
            keyEvent.key === 'Enter') {
            this.update.emit(this.wordToSearch);
        }
    }
}
