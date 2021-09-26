import { Component } from '@angular/core';
import { skip, tap } from 'rxjs/operators';
import { SidebarItem } from './components/sidebar/sidebar.component';
import { Role, User } from './entities/user';
import { SecurityProvider } from './providers/security.provider';

const userSidebarItems: SidebarItem[] = [
  new SidebarItem('Mój profil', 'account_circle', '/users/'),
  new SidebarItem('Pokoje', 'group', '/'),
  new SidebarItem('Użytkownicy', 'groups', '/users/'),
  new SidebarItem('Wyloguj się', 'logout', 'security/signout')
]

const moderatorSidebarItems: SidebarItem[] = [
  new SidebarItem('Mój profil', 'account_circle', '/users/'),
  new SidebarItem('Pokoje', 'group', '/'),
  new SidebarItem('Użytkownicy', 'groups', '/users/'),
  new SidebarItem('Zablokowani użytkownicy', 'block', 'blocked-users'),
  new SidebarItem('Wyloguj się', 'logout', 'security/signout')
]
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public user: User;

  public siderbarItems: SidebarItem[] = []

  constructor(
    private securityProvider: SecurityProvider
    ) {
      this.securityProvider.user.pipe(
        skip(1),
        tap((user: User) => {
          this.user = user;
          if(user) {
            switch (user?.role) {
              case Role.ADMINISTRATOR:
                this.siderbarItems = moderatorSidebarItems;
                break;
  
              case Role.MODERATOR:
                this.siderbarItems = moderatorSidebarItems;
                break;
  
              case Role.USER:
                this.siderbarItems = userSidebarItems;
                break;
            }
            let userItem = this.siderbarItems.find(item => item.text === 'Mój profil');
            
            if(userItem) {
              userItem.route = `/users/${this.user.nickname}`;
            }
          }
        })
      ).subscribe();
    }
}
