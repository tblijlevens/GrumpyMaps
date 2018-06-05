import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SquareDetailComponent } from './square-detail.component';

describe('SquareDetailComponent', () => {
  let component: SquareDetailComponent;
  let fixture: ComponentFixture<SquareDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SquareDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SquareDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
