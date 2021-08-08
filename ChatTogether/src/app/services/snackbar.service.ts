import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SnackbarComponent } from "../components/snackbar/snackbar.component";
import { SnackbarData, SnackbarVariant } from "../components/snackbar/snackbar.data";

@Injectable({
    providedIn: 'root'
})
export class SnakcbarService {
    constructor(
        private snackbar: MatSnackBar
    ) { }

    public open(message: string, duration: number = 10000, variant: SnackbarVariant = SnackbarVariant.INFO) {
        this.snackbar.openFromComponent(SnackbarComponent, {
            data: <SnackbarData>{
                message,
                variant
            },
            duration,
            panelClass: [
                "snackbar-width", 
                variant === SnackbarVariant.ERROR ? "snackbar-error" : null
            ]
        })
    }
}