import { NgModule, LOCALE_ID } from '@angular/core';
import localePl from '@angular/common/locales/pl';
import localePlExtra from '@angular/common/locales/extra/pl';
import { registerLocaleData } from '@angular/common';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from './components/shared/shared.module';

import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppComponent } from './app.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component';

import { RoomService } from './services/room.service';
import { MessageService } from './services/message.service';
import { SecurityService } from './services/security.service';
import { UserService } from './services/user.service';
import { TopbarTitleService } from './services/topbarTitle.service';
import { SnackbarService } from './services/snackbar.service';

import { InformationHub } from './Hubs/InformationHub';
import { RoomHub } from './Hubs/RoomHub';

import { CredentialsInterceptor } from './interceptors/CredentialsInterceptor';
import { UnauthorizedInterceptor } from './interceptors/UnauthorizedInterceptor';
import { ExceptionHandlerInterceptor } from './interceptors/ExceptionHandlerInterceptor';
import { MessageFileOverlayComponent } from './components/messages/message-file-overlay/message-file-overlay.component';

registerLocaleData(localePl, localePlExtra);

@NgModule({
  declarations: [
    AppComponent,
    TopbarComponent,
    SidebarComponent,
    SnackbarComponent,
    MessageFileOverlayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    // Angular material
    MatSelectModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatDividerModule,
    MatSnackBarModule,
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
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ExceptionHandlerInterceptor,
      multi: true
    },
    {
      provide: LOCALE_ID,
      useValue: 'pl-PL'
    },
    RoomService,
    MessageService,
    SecurityService,
    UserService,
    InformationHub,
    RoomHub,
    TopbarTitleService,
    SnackbarService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
