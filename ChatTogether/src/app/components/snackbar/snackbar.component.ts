import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { SnackbarData } from './snackbar.data';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent implements OnInit {
  constructor(
    private matSnack: MatSnackBar, 
    @Inject(MAT_SNACK_BAR_DATA) public data : SnackbarData
    ) { }

  ngOnInit(): void {
    
  }

  close() {
    this.matSnack.dismiss();
  }
}
