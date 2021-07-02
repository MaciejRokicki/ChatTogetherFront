import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MDCTopAppBar } from '@material/top-app-bar';
import { MDCRipple } from '@material/ripple';
import { tap } from 'rxjs/operators';
import { TopbarTitleService } from 'src/app/services/topbarTitle.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  @Input() topBarTitle: string = '';

  constructor(private topbarTitleService: TopbarTitleService, private router: Router) { }

  ngOnInit(): void {
    console.log("TOPBAR");
    const topAppBarElement = document.querySelector('.mdc-top-app-bar') as Element;
    const topAppBar = new MDCTopAppBar(topAppBarElement);

    const iconButtonRipple = new MDCRipple(document.querySelector('.mdc-icon-button') as Element);
    iconButtonRipple.unbounded = true;

    this.topbarTitleService.title$.pipe(
      tap((title: string) => {
        this.topBarTitle = title;
      })
    ).subscribe();
  }
}
