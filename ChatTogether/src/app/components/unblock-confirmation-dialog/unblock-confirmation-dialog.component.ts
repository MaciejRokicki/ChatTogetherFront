import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { Result, ResultStage } from 'src/app/entities/result';
import { BlockedUser } from 'src/app/entities/Security/blockedUser';
import { SecurityProvider } from 'src/app/providers/security.provider';

@Component({
  selector: 'app-unblock-confirmation-dialog',
  templateUrl: './unblock-confirmation-dialog.component.html',
  styleUrls: ['./unblock-confirmation-dialog.component.scss']
})
export class UnblockConfirmationDialogComponent implements OnInit {
  unblockConfimationForm = new FormGroup({});

  constructor(
    private dialogRef: MatDialogRef<UnblockConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BlockedUser,
    private securityProvider: SecurityProvider) { }

  ngOnInit(): void { }

  close(result?: any): void {
    this.dialogRef.close(result);
  }

  unblock(): void {
    this.securityProvider.unblockUser(this.data.userId);
    
    this.securityProvider.resultUnblockUser.pipe(
      tap((result: Result) => {
        switch (result.Stage) {
          case ResultStage.WAITING:
            break;

          case ResultStage.SUCCESS:
            this.close({
              showSnackbar: true
            });
            break;

          case ResultStage.ERROR:
            this.close({
              showSnackbar: false,
              success: false
            })
            break;
        }
      })
    ).subscribe();
  }
}
