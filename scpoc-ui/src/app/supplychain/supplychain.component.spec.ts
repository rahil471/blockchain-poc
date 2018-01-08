import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplychainComponent } from './supplychain.component';

describe('SupplychainComponent', () => {
  let component: SupplychainComponent;
  let fixture: ComponentFixture<SupplychainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplychainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplychainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
