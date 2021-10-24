import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageFileToUploadComponent } from './message-file-to-upload.component';

describe('MessageFileToUploadComponent', () => {
  let component: MessageFileToUploadComponent;
  let fixture: ComponentFixture<MessageFileToUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageFileToUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageFileToUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
