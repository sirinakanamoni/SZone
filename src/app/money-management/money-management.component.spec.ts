import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyManagementComponent } from './money-management.component';

describe('MoneyManagementComponent', () => {
  let component: MoneyManagementComponent;
  let fixture: ComponentFixture<MoneyManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoneyManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MoneyManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
