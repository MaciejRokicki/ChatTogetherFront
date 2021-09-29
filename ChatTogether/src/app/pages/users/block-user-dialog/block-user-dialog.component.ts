import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { Result, ResultStage } from 'src/app/entities/result';
import { BlockUserModel } from 'src/app/entities/Security/blockUserModel';
import { User } from 'src/app/entities/user';
import { SecurityProvider } from 'src/app/providers/security.provider';
import { FormControlStateMatcher } from 'src/app/utils/formControlStateMatcher';

@Component({
  selector: 'app-block-user-dialog',
  templateUrl: './block-user-dialog.component.html',
  styleUrls: ['./block-user-dialog.component.scss']
})
export class BlockUserDialogComponent implements OnInit {
  invalidFormMatcher = new FormControlStateMatcher();
  minDate: Date;

  blockForm = new FormGroup({
    reason: new FormControl('', [Validators.required]),
    blockedTo: new FormControl('', []),
  });

  constructor(
    private dialogRef: MatDialogRef<BlockUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private securityProvider: SecurityProvider) { 
      const d: Date = new Date();
      this.minDate = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)
    }

  ngOnInit(): void { }

  close(result?: any): void {
    this.dialogRef.close(result);
  }

  block(): void {
    const blockUserModel: BlockUserModel = <BlockUserModel>{
      userId: this.data.userId,
      reason: this.blockForm.get('reason').value,
      blockedTo: this.blockForm.get('blockedTo').value
    }

    if (blockUserModel.blockedTo) {
      blockUserModel.blockedTo = new Date(Date.UTC(blockUserModel.blockedTo.getUTCFullYear(), blockUserModel.blockedTo.getUTCMonth(), blockUserModel.blockedTo.getUTCDate()))
    } else {
      blockUserModel.blockedTo = null;
    }

    this.securityProvider.blockUser(blockUserModel);

    this.securityProvider.result.pipe(
      tap((result: Result) => {
        if (result.Stage === ResultStage.SUCCESS) {
          this.close({
            showSnackbar: true
          });
        }
      })
    ).subscribe();
  }
}
