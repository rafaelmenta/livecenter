import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameCardViewComponent } from './game-card-view.component';

describe('GameCardViewComponent', () => {
  let component: GameCardViewComponent;
  let fixture: ComponentFixture<GameCardViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameCardViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameCardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
