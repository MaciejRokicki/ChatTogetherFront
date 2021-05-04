import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MDCTopAppBar } from '@material/top-app-bar';
import { MDCRipple } from '@material/ripple';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  title: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    const topAppBarElement = document.querySelector('.mdc-top-app-bar') as Element;
    const topAppBar = new MDCTopAppBar(topAppBarElement);

    const iconButtonRipple = new MDCRipple(document.querySelector('.mdc-icon-button') as Element);
    iconButtonRipple.unbounded = true;

    switch (this.router.url) {
      case '/':
        this.title = "Pokoje";
        break;
    }
  }
}
