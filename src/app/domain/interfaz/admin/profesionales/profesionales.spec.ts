import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Profesionales } from './profesionales';

describe('Profesionales', () => {
  let component: Profesionales;
  let fixture: ComponentFixture<Profesionales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Profesionales]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Profesionales);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
