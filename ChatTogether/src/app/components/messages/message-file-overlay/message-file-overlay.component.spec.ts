import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageFileOverlayComponent } from './message-file-overlay.component';

describe('MessageFileOverlayComponent', () => {
  let component: MessageFileOverlayComponent;
  let fixture: ComponentFixture<MessageFileOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageFileOverlayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageFileOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
