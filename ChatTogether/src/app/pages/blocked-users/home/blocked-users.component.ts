import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IPaginator } from 'src/app/components/paginator/ipaginator';
import { SnackbarVariant } from 'src/app/components/snackbar/snackbar.data';
import { Page } from 'src/app/entities/page';
import { BlockedUser } from 'src/app/entities/Security/blockedUser';
import { SecurityProvider } from 'src/app/providers/security.provider';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { TopbarTitleService } from 'src/app/services/topbarTitle.service';
import { UnblockConfirmationDialogComponent } from '../unblock-confirmation-dialog/unblock-confirmation-dialog.component';

@Component({
  selector: 'app-blocked-users',
  templateUrl: './blocked-users.component.html',
  styleUrls: ['./blocked-users.component.scss']
})
export class BlockedUsersComponent implements OnInit, OnDestroy, IPaginator {
  searchForm = new FormGroup({
    search: new FormControl('', []),
  });

  displayedColumns: string[] = ['email', 'nickname', 'reason', 'created', 'blockedTo', 'createdByNickname', 'action'];

  blockedUsers: Page<BlockedUser>
  blockedUsers$: Subscription = new Subscription();

  constructor(
    private securityProvider: SecurityProvider,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private topbarTitleService: TopbarTitleService
    ) { 
      this.topbarTitleService.setTitle("Zablokowani użytkownicy");
    }

  ngOnInit(): void {
    this.securityProvider.getBlockedUsers(1, null);

    this.blockedUsers$ = this.securityProvider.blockedUsers.pipe(
      tap((blockedUsers: Page<BlockedUser>) => {
        this.blockedUsers = blockedUsers;
      })
    ).subscribe();
  }

  search(): void {
    let search: string = this.searchForm.controls['search'].value;
    this.securityProvider.getBlockedUsers(1, search);
  }

  nextPage(): void {
    this.blockedUsers.currentPage++;
    
    let search: string = this.searchForm.controls['search'].value;
    this.securityProvider.getBlockedUsers(this.blockedUsers.currentPage, search);
  }

  previousPage(): void {
    this.blockedUsers.currentPage--;

    let search: string = this.searchForm.controls['search'].value;
    this.securityProvider.getBlockedUsers(this.blockedUsers.currentPage, search);
  }

  unblockConfirmationOpenModel(event: Event, blockedUser: BlockedUser) {
    event.preventDefault();
    event.stopPropagation();

    const createRoomDialogRef = this.dialog.open(UnblockConfirmationDialogComponent, {
      width: 'calc(100% - 30px)',
      minWidth: 300,
      maxWidth: 400,
      data: blockedUser
    });

    createRoomDialogRef.afterClosed().subscribe(result => {
      if(result?.showSnackbar) {
        this.snackbarService.open(`Konto o adresie email: ${blockedUser.email} zostało odblokowane.`, 10000, SnackbarVariant.SUCCESS);
        
        let search: string = this.searchForm.controls['search'].value;
        this.securityProvider.getBlockedUsers(this.blockedUsers.currentPage, search);
      }
    }); 
  }

  ngOnDestroy(): void {
    this.blockedUsers$.unsubscribe();
  }

}
