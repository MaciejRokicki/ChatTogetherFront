import { Component, Input, OnInit } from '@angular/core';
import { MDCDrawer, MDCDismissibleDrawerFoundation } from "@material/drawer";
import { MDCList } from "@material/list";

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
export class SidebarComponent implements OnInit {

  @Input() items: SidebarItem[] = [];

  constructor() { }

  ngOnInit(): void { }

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

    window.addEventListener('resize', () => {
      if (drawerFoundation)
        drawerFoundation.close();
    })
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
}
