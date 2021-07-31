import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SnackbarComponent } from "../components/snackbar/snackbar.component";
import { SnackbarData } from "../components/snackbar/snackbar.data";

@Injectable({
    providedIn: 'root'
})
export class SnakcbarService {
    constructor(
        private snackbar: MatSnackBar
    ) { }

    public open(message: string, duration: number = 10000) {
        this.snackbar.openFromComponent(SnackbarComponent, {
            data: <SnackbarData>{
                message
            },
            duration,
            panelClass: ["snackbar-width"]
        })
    }
}