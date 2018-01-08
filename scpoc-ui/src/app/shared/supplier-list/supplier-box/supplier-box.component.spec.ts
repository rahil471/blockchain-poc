import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierBoxComponent } from './supplier-box.component';

describe('SupplierBoxComponent', () => {
  let component: SupplierBoxComponent;
  let fixture: ComponentFixture<SupplierBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
