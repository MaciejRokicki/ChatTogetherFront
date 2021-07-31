import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  
      this.close({
        showSnackbar: true
      });
    }

}
