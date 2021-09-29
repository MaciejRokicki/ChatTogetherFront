import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from 'src/app/entities/user';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SecurityProvider } from 'src/app/providers/security.provider';
import { ChangeRoleModel } from 'src/app/entities/Security/changeRoleModel';
import { tap } from 'rxjs/operators';
import { Result, ResultStage } from 'src/app/entities/result';

@Component({
  selector: 'app-change-role-dialog',
  templateUrl: './change-role-dialog.component.html',
  styleUrls: ['./change-role-dialog.component.scss']
})
export class ChangeRoleDialogComponent implements OnInit {
  changeRoleForm = new FormGroup({
    role: new FormControl('', [])
  });

  roles: Object = {
    'ADMINISTRATOR': '0',
    'MODERATOR': '1',
    'USER': '2'
  }

  constructor(
    private dialogRef: MatDialogRef<ChangeRoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private securityProvider: SecurityProvider) { }

  ngOnInit(): void {
    this.changeRoleForm.setValue({
      role: this.roles[this.data.role]
    })
  }

  close(result?: any): void {
    this.dialogRef.close(result);
  }

  changeRole(): void {
    let role = Number.parseInt(this.changeRoleForm.get('role').value);

    const changeRoleModel: ChangeRoleModel = <ChangeRoleModel>{
      userId: this.data.userId,
      role: role
    };

    this.securityProvider.changeRole(changeRoleModel);

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
