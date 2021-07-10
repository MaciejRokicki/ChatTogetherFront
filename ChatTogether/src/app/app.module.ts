import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

import { RoomService } from './services/room.service';
import { MessageService } from './services/message.service';
import { SecurityService } from './services/security.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Hub } from './Hub';
import { CredentialsInterceptor } from './interceptors/CredentialsInterceptor';
import { TopbarTitleService } from './services/topbarTitle.service';
import { UnauthorizedInterceptor } from './interceptors/UnauthorizedInterceptor';
import { UserService } from './services/user.service';

@NgModule({
  declarations: [
    AppComponent,
    TopbarComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CredentialsInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedInterceptor,
      multi: true
    },
    RoomService,
    MessageService,
    SecurityService,
    UserService,
    Hub,
    TopbarTitleService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
