import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { Result, ResultStage } from 'src/app/entities/result';
import { User } from 'src/app/entities/user';
import { UserProvider } from 'src/app/providers/user.provider';

export interface EditAboutMeData {
  user: User;
  aboutMe: string;
}

@Component({
  selector: 'app-edit-about-me-dialog',
  templateUrl: './edit-about-me-dialog.component.html',
  styleUrls: ['./edit-about-me-dialog.component.scss']
})
export class EditAboutMeDialogComponent implements OnInit {
  editAboutMeForm = new FormGroup({
    aboutMe: new FormControl('', []),
  });

  disabledSaveButton: boolean = false;
  
  constructor(
    private dialogRef: MatDialogRef<EditAboutMeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditAboutMeData,
    private userProvider: UserProvider
  ) { }

  ngOnInit(): void {
    this.editAboutMeForm.setValue({
      aboutMe: this.data.aboutMe
    })
  }

  close(result?: any): void {
    this.dialogRef.close(result);
  }

  editAboutMe(): void {
    let newUser = this.data.user;
    newUser.description = this.editAboutMeForm.get('aboutMe').value;
    
    this.userProvider.changeUserData(newUser);

    this.userProvider.resultChangeUserData.pipe(
      tap((result: Result) => {
        switch (result.Stage) {
          case ResultStage.WAITING:
              this.disabledSaveButton = true;
            break;

          case ResultStage.SUCCESS:
              this.close({
                showSnackbar: true
              });
              this.disabledSaveButton = false;
            break;

          case ResultStage.ERROR:
              this.close({
                showSnackbar: false,
                success: false
              });
              this.disabledSaveButton = false;
            break;
        }
      })
    ).subscribe();
  }

}
