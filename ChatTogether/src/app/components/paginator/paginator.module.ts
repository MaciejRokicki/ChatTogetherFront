import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/components/shared/shared.module';
import { PaginatorComponent } from 'src/app/components/paginator/paginator.component';

@NgModule({
    declarations: [
        PaginatorComponent
    ],
    imports: [
        SharedModule,
    ],
    exports: [PaginatorComponent]
})
export class PaginatorModule { }