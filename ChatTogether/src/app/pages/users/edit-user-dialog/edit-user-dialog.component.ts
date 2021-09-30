import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from 'src/app/entities/user';
import { UserProvider } from 'src/app/providers/user.provider';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { Result, ResultStage } from 'src/app/entities/result';

export interface EditUserData {
  firstName: string;
  lastName: string;
  birthDate: string;
  city: string;
}

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.scss']
})
export class EditUserDialogComponent implements OnInit {
  editUserForm = new FormGroup({
    firstName: new FormControl('', []),
    lastName: new FormControl('', []),
    birthDate: new FormControl('', []),
    city: new FormControl('', []),
  });

  constructor(
    private dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditUserData,
    private userProvider: UserProvider) { }

  ngOnInit(): void {
    this.editUserForm.setValue({
      firstName: this.data.firstName,
      lastName: this.data.lastName,
      birthDate: this.data.birthDate,
      city: this.data.city
    })
  }

  close(result?: any): void {
    this.dialogRef.close(result);
  }

  editUser(): void {
    let firstName = this.editUserForm.get('firstName').value
    let lastName = this.editUserForm.get('lastName').value
    let birthDate = this.editUserForm.get('birthDate').value
    let city = this.editUserForm.get('city').value

    let user = new User(undefined, undefined, firstName, lastName, undefined, birthDate, city, undefined, undefined);
    this.userProvider.changeUserData(user);

    this.userProvider.resultChangeUserData.pipe(
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
