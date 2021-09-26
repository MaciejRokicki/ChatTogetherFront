import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnblockConfirmationDialogComponent } from './unblock-confirmation-dialog.component';

describe('UnblockConfirmationDialogComponent', () => {
  let component: UnblockConfirmationDialogComponent;
  let fixture: ComponentFixture<UnblockConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnblockConfirmationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnblockConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
