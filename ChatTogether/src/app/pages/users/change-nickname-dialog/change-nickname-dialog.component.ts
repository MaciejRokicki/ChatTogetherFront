import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { Result, ResultStage } from 'src/app/entities/result';
import { UserProvider } from 'src/app/providers/user.provider';

@Component({
  selector: 'app-change-nickname-dialog',
  templateUrl: './change-nickname-dialog.component.html',
  styleUrls: ['./change-nickname-dialog.component.scss']
})
export class ChangeNicknameDialogComponent implements OnInit {
  changeNicknameForm = new FormGroup({
    nickname: new FormControl('', []),
  });

  constructor(    
    private dialogRef: MatDialogRef<ChangeNicknameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private userProvider: UserProvider
    ) { }

    ngOnInit(): void {
      this.changeNicknameForm.setValue({
        nickname: this.data
      })
    }
  
    close(result?: any): void {
      this.dialogRef.close(result);
    }
  
    changeNickname(): void {
      this.userProvider.changeNickname(this.changeNicknameForm.get('nickname').value);
  
      this.userProvider.resultChangeNickname.pipe(
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
                success: false,
                msg: result.Message
              })
              break;
          }
        })
      ).subscribe();
    }

}
