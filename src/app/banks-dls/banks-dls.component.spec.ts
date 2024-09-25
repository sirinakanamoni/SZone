import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BanksDlsComponent } from './banks-dls.component';

describe('BanksDlsComponent', () => {
  let component: BanksDlsComponent;
  let fixture: ComponentFixture<BanksDlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BanksDlsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BanksDlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
