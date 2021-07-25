import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TopbarTitleService } from 'src/app/services/topbarTitle.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit, OnDestroy {
  topBarTitle: string = '';
  topBarTitle$: Subscription;

  constructor(private topbarTitleService: TopbarTitleService) { }

  ngOnInit(): void {
    this.topBarTitle$ = this.topbarTitleService.title.pipe(
      tap((title: string) => {
        this.topBarTitle = title;
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.topBarTitle$.unsubscribe();
  }
}
