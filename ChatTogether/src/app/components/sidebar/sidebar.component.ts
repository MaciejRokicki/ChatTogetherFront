import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from 'src/app/entities/user';

export class SidebarItem {
  constructor(
    public text: string,
    public icon: string,
    public route: string
  ) { }
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  @Input() user: User;
  @Input() items: SidebarItem[] = [];
  resizeEvent$: Subscription = new Subscription();

  mode: 'over' | 'push' | 'side' = 'side';
  isOpen: boolean = true;

  constructor() { }

  ngOnInit(): void {
    if(window.innerWidth < 767) {
      this.mode = 'over';
      this.isOpen = false;
    }
  }

  ngAfterViewInit(): void {
    (document.getElementById('menuButton') as Element).addEventListener('click', () => {
      this.isOpen = !this.isOpen;
    });

    this.resizeEvent$ = fromEvent(window, 'resize').pipe(
      tap(() => {
        if(window.innerWidth < 767) {
          this.mode = 'over';
          this.isOpen = false;
        } else {
          this.mode = 'side';
          this.isOpen = true;
        }
      })
    ).subscribe();
  }

  openedChange(isOpen: boolean): void {
    this.isOpen = isOpen;
  }

  closeSidebar(): void {
    if (window.innerWidth < 767) {
      this.isOpen = false;
    }
  }

  ngOnDestroy() {
    this.resizeEvent$.unsubscribe();
  }
}
