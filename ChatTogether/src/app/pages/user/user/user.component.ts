import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TopbarTitleService } from 'src/app/services/topbarTitle.service';
import { MDCRipple } from '@material/ripple';
import { SecurityProvider } from 'src/app/providers/security.provider';
import { User } from 'src/app/entities/user';
import { Subscription } from 'rxjs';
import { last, tap } from 'rxjs/operators';
import { UserProvider } from 'src/app/providers/user.provider';
import { MDCSnackbar } from '@material/snackbar';
import { MDCDialog } from '@material/dialog';
import { MDCTextField } from '@material/textfield';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy, AfterViewInit {

  nickname: string;
  nickname$: Subscription;

  authUser: User;
  authUser$: Subscription;

  user: User;
  user$: Subscription;

  snackbar: MDCSnackbar;

  userEditModal: MDCDialog;
  firstNameTextField: MDCTextField;
  lastNameTextFields: MDCTextField;
  cityTextField: MDCTextField;

  aboutMeEditModal: MDCDialog;
  aboutMeTextField: MDCTextField;

  changeNicknameModal: MDCDialog;

  userEditForm = new FormGroup({
    firstName: new FormControl('', []),
    lastName: new FormControl('', []),
    city: new FormControl('', []),
  });

  aboutMeEditForm = new FormGroup({
    aboutMe: new FormControl('', []),
  });

  changeNicknameForm = new FormGroup({
    nickname: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private topbarTitleService: TopbarTitleService,
    private securityProvider: SecurityProvider,
    private userProvider: UserProvider
    ) { }

  ngOnInit(): void {
    this.nickname$ = this.route.params.pipe(
      tap((params: Params) => {
        this.nickname = params['nickname'];
      }),
      tap(() => {
        this.userProvider.getUser(this.nickname);
        this.user$ = this.userProvider.user.pipe(
          tap((user: User) => {
            this.user = user;
          })
        ).subscribe();
      }),
      tap(() => {
        this.authUser$ = this.securityProvider.user.pipe(
          tap((user: User) => {
            this.authUser = user;
    
            if(this.nickname === this.authUser?.nickname) {
              this.topbarTitleService.setTitle("Mój profil");
            } else {
              this.topbarTitleService.setTitle(this.nickname);
            }
          })
        ).subscribe()
      })
    ).subscribe()
  }

  ngAfterViewInit(): void {
    const userEdit = new MDCRipple(document.getElementById('userEdit') as Element);
    userEdit.unbounded = true;
    const aboutMeEdit = new MDCRipple(document.getElementById("aboutMeEdit") as Element);
    aboutMeEdit.unbounded = true;

    new MDCRipple(document.getElementById("changeNickname") as Element);
    new MDCRipple(document.getElementById("changeEmail") as Element);
    new MDCRipple(document.getElementById("changePassword") as Element);

    this.snackbar = new MDCSnackbar(document.querySelector('.mdc-snackbar'));
    this.snackbar.timeoutMs = 10000;

    this.userEditModal = new MDCDialog(document.getElementById('userEditModal'));
    this.firstNameTextField = new MDCTextField(document.getElementById('firstNameField'));
    this.lastNameTextFields = new MDCTextField(document.getElementById('lastNameField'));
    this.cityTextField = new MDCTextField(document.getElementById('cityField'));

    this.aboutMeEditModal = new MDCDialog(document.getElementById('aboutMeEditModal'));
    this.aboutMeTextField = new MDCTextField(document.getElementById('aboutMeTextArea'));

    this.changeNicknameModal = new MDCDialog(document.getElementById('changeNicknameModal'));
    new MDCTextField(document.getElementById('nicknameField') as Element);
  }

  changeNicknameOpenModal(): void {
    this.changeNicknameModal.open();
  }

  changeNickname(): void {
    this.userProvider.changeNickname(this.changeNicknameForm.get('nickname').value);
    this.snackbar.labelText = "Pseudonim został zmieniony.";
    this.snackbar.open();
    this.securityProvider.signout();
    this.router.navigate(['security/signin']);
  }

  changeEmail(): void {
    this.securityProvider.changeEmailRequest();
    this.snackbar.labelText = "Prośba o zmianę adres email została wysłana na aktualny adres email.";
    this.snackbar.open();
  }

  changePassword(): void {
    this.securityProvider.changePasswordRequest();
    this.snackbar.labelText = "Prośba o zmianę hasła została wysłana na adres email.";
    this.snackbar.open();
  }

  userEditOpenModal(): void {
    // zeby textFiledy sie nie bugowaly jak sa jakies wartosci na start
    this.firstNameTextField.value = this.user.firstName ? this.user.firstName : "";
    this.lastNameTextFields.value = this.user.lastName ? this.user.lastName : "";
    this.cityTextField.value = this.user.city ? this.user.city : "";

    // zeby form mial warotsci, a nie same inputy
    this.userEditForm.setValue({
      firstName: this.firstNameTextField.value,
      lastName: this.lastNameTextFields.value,
      city: this.cityTextField.value,
    })

    this.userEditModal.open();
  }

  userEdit(): void {
    let firstName = this.userEditForm.get('firstName').value
    let lastName = this.userEditForm.get('lastName').value
    let city = this.userEditForm.get('city').value

    let user = new User(null, firstName, lastName, null, city, null);

    this.userProvider.changeUserData(user);

    this.snackbar.labelText = "Dane zostały zmienione.";
    this.snackbar.open();
  }

  aboutMeEditOpenModal(): void {
    // zeby textFiledy sie nie bugowaly jak sa jakies wartosci na start
    this.aboutMeTextField.value = this.user.description ? this.user.description : "";

    // zeby form mial warotsci, a nie same inputy
    this.aboutMeEditForm.setValue({
      aboutMe: this.aboutMeTextField.value,
    })

    this.aboutMeEditModal.open();
  }

  aboutMeEdit(): void {
    this.userProvider.changeUserDescription(this.aboutMeEditForm.get('aboutMe').value);

    this.snackbar.labelText = "Opis został zmieniony.";
    this.snackbar.open();
  }

  ngOnDestroy(): void {
    this.nickname$.unsubscribe();
    this.user$.unsubscribe();
    this.authUser$.unsubscribe();
  }

}
