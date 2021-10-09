import { Component, OnInit } from '@angular/core';
import { SecurityProvider } from 'src/app/providers/security.provider';

@Component({
  selector: 'app-signout',
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.scss']
})
export class SignoutComponent implements OnInit {

  constructor(
    private securityProvider: SecurityProvider
  ) { }

  ngOnInit(): void {
    this.securityProvider.signout();
  }

}
