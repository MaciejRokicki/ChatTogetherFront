import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAboutMeDialogComponent } from './edit-about-me-dialog.component';

describe('EditAboutMeDialogComponent', () => {
  let component: EditAboutMeDialogComponent;
  let fixture: ComponentFixture<EditAboutMeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAboutMeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAboutMeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
