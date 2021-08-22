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

  theme: string;

  constructor(private topbarTitleService: TopbarTitleService) { 
    this.theme = localStorage.getItem("theme");

    switch(this.theme) {
      case "light":
        this.setLightTheme();
        break;
      case "dark":
        this.setDarkTheme();
        break;
      default:
        this.setLightTheme()
        break;
    }
  }

  ngOnInit(): void {
    this.topBarTitle$ = this.topbarTitleService.title.pipe(
      tap((title: string) => {
        this.topBarTitle = title;
      })
    ).subscribe();
  }

  toggleTheme() {
    switch(this.theme) {
      case "light":
        this.setDarkTheme();
        break;
      case "dark":
        this.setLightTheme();
        break;
      default:
        this.setLightTheme()
        break;
    }
  }

  private setDarkTheme() {
    document.body.classList.remove("light-theme");
    document.body.classList.add("dark-theme");
    this.theme = "dark";
    localStorage.setItem("theme", this.theme);
  }

  private setLightTheme() {
    document.body.classList.remove("dark-theme");
    document.body.classList.add("light-theme");
    this.theme = "light";
    localStorage.setItem("theme", this.theme);
  }

  ngOnDestroy(): void {
    this.topBarTitle$.unsubscribe();
  }
}
