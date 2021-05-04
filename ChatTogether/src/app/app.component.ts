import { Component } from '@angular/core';
import { SidebarItem } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public siderbarItems: SidebarItem[] = [
    new SidebarItem('Pokoje', 'inbox', '/'),
    new SidebarItem('Pokoje2', 'send', '/'),
    new SidebarItem('Pokoje3', 'drafts', '/')
  ]
}
