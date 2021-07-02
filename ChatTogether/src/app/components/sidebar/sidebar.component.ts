import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MDCDrawer, MDCDismissibleDrawerFoundation } from "@material/drawer";
import { MDCList } from "@material/list";
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

  constructor() { }

  ngOnInit(): void { 
    console.log("SIDEBAR");
  }

  ngAfterViewInit(): void {
    const list = MDCList.attachTo(document.querySelector('.mdc-list') as Element);
    list.wrapFocus = false;
    var drawerElement = document.querySelector('.mdc-drawer') as Element;

    var drawer: MDCDrawer;
    var drawerFoundation: MDCDismissibleDrawerFoundation;
    (document.getElementById('menuButton') as Element).addEventListener('click', () => {
      if (!drawer) {
        drawer = MDCDrawer.attachTo(drawerElement);
        drawerFoundation = drawer.getDefaultFoundation();
      }

      drawer.open = !drawer.open;
    });

    this.resizeEvent$ = fromEvent(window, 'resize').pipe(
      tap(() => {
        if(drawerFoundation) {
          drawerFoundation.close();
        }
      })
    ).subscribe();
  }

  public IsModalAvailable(): boolean {
    if (window.innerWidth < 767) {
      return true;
    }

    return false;
  }

  public CloseModal():void {
    if (window.innerWidth < 767) {
      var drawerElement = document.getElementsByClassName('mdc-drawer mdc-drawer--modal')[0] as Element;
      var drawer = MDCDrawer.attachTo(drawerElement);

      if(drawer.open)
        drawer.open = false;

      drawer.destroy();
    }
  }

  ngOnDestroy() {
    this.resizeEvent$.unsubscribe();
  }
}
