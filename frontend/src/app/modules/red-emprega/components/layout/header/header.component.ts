import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 're-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css', './../layout.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    if (window.scrollY > 1.5) {
      document.getElementById('header')?.classList.add('header-scrolled');
    } else {
      document.getElementById('header')?.classList.remove('header-scrolled');
    }
  }


   /**
   * Scrolls to an element with header offset
   */

}

