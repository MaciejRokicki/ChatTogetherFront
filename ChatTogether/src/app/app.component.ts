import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SidebarItem } from './components/sidebar/sidebar.component';
import { User } from './entities/user';
import { AuthProvider } from './providers/auth.provider';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public user$: Observable<User> = this.authProvider.user;

  public siderbarItems: SidebarItem[] = [
    new SidebarItem('Mój profil', 'account_circle', '/user/xyz'),
    new SidebarItem('Pokoje', 'groups', '/'),
    new SidebarItem('Wyloguj się', 'logout', 'security/signout')
  ]

  constructor(
    private authProvider: AuthProvider,
    ) { 
      authProvider.validate();
      console.log("APP_COMPONENT");
    }
}
