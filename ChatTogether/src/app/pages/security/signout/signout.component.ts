import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityProvider } from 'src/app/providers/security.provider';

@Component({
  selector: 'app-signout',
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.scss']
})
export class SignoutComponent implements OnInit {

  constructor(
    private securityProvider: SecurityProvider,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.securityProvider.signout();
    this.router.navigate(['security/signin'])
    this.securityProvider.user.subscribe().unsubscribe();
  }

}
