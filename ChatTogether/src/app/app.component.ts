import { Component } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { filter, skip, tap } from 'rxjs/operators';
import { SidebarItem } from './components/sidebar/sidebar.component';
import { User } from './entities/user';
import { SecurityProvider } from './providers/security.provider';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public user: User;

  public siderbarItems: SidebarItem[] = [
    new SidebarItem('Mój profil', 'account_circle', '/user/'),
    new SidebarItem('Pokoje', 'groups', '/'),
    new SidebarItem('Wyloguj się', 'logout', 'security/signout')
  ]

  constructor(
    private router: Router,
    private securityProvider: SecurityProvider
    ) {
      this.securityProvider.user.pipe(
        skip(1),
        tap((user: User) => {
          this.user = user;
          if(user) {
            let userItem = this.siderbarItems.find(item => item.text === 'Mój profil');
            if(userItem) {
              userItem.route = `/user/${this.user.nickname}`;
            }
          }
        })
      ).subscribe();

      //TODO: zrobic liste podstron, ktore maja sie wyswietlac bez topbara i sidebara
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        tap((event: Event) => {
          console.log(event);
        })
      ).subscribe()

      //securityProvider.validate();
      console.log("APP_COMPONENT");
    }
}
