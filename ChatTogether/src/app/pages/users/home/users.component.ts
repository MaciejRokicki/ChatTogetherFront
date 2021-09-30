import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IPaginator } from 'src/app/components/paginator/ipaginator';
import { Page } from 'src/app/entities/page';
import { Result, ResultStage } from 'src/app/entities/result';
import { Role, User } from 'src/app/entities/user';
import { UserProvider } from 'src/app/providers/user.provider';
import { TopbarTitleService } from 'src/app/services/topbarTitle.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy, IPaginator {
  searchForm = new FormGroup({
    search: new FormControl('', []),
    role: new FormControl('null', []),
  });
  
  displayedColumns: string[] = ['nickname', 'firstName', 'lastName', 'role', 'action'];

  users: Page<User>;
  users$: Subscription = new Subscription();

  showSpinner: boolean = true;

  roleTranslations: Object = {
    "ADMINISTRATOR": "Administrator",
    "MODERATOR": "Moderator",
    "USER": "Użytkownik"
  }

  constructor(
    private userProvider: UserProvider,
    private topbarTitleService: TopbarTitleService
    ) { 
      this.topbarTitleService.setTitle("Użytkownicy");
    }

  ngOnInit(): void {
    this.userProvider.resultGetUsers.pipe(
      tap((result: Result) => {
        switch (result.Stage) {
          case ResultStage.WAITING:
            this.showSpinner = true;
            break;
          
          case ResultStage.SUCCESS:
            this.showSpinner = false;
            break;

          case ResultStage.ERROR:
            this.showSpinner = false;
            break;
        }
      })
    ).subscribe();

    this.userProvider.getUsers(1, null);

    this.users$ = this.userProvider.users.pipe(
      tap((users: Page<User>) => {
        this.users = users;
      })
    ).subscribe();
  }

  search(): void {
    let search: string = this.searchForm.controls['search'].value;
    let role: Role = this.searchForm.controls['role'].value === "null" ? null : this.searchForm.controls['role'].value;
    
    this.userProvider.getUsers(1, search, role);
  }

  firstPage(): void {
    this.users.currentPage = 1;

    let search: string = this.searchForm.controls['search'].value;
    let role: Role = this.searchForm.controls['role'].value === "null" ? null : this.searchForm.controls['role'].value;
    
    this.userProvider.getUsers(this.users.currentPage, search, role);
  }

  previousPage(): void {
    this.users.currentPage--;

    let search: string = this.searchForm.controls['search'].value;
    let role: Role = this.searchForm.controls['role'].value === "null" ? null : this.searchForm.controls['role'].value;
    
    this.userProvider.getUsers(this.users.currentPage, search, role);
  }

  nextPage(): void {
    this.users.currentPage++;
    
    let search: string = this.searchForm.controls['search'].value;
    let role: Role = this.searchForm.controls['role'].value === "null" ? null : this.searchForm.controls['role'].value;
    
    this.userProvider.getUsers(this.users.currentPage, search, role);
  }

  lastPage(): void {
    this.users.currentPage = this.users.pageCount;

    let search: string = this.searchForm.controls['search'].value;
    let role: Role = this.searchForm.controls['role'].value === "null" ? null : this.searchForm.controls['role'].value;
    
    this.userProvider.getUsers(this.users.currentPage, search, role);
  }

  ngOnDestroy(): void {
    this.users$.unsubscribe();
  }
}
