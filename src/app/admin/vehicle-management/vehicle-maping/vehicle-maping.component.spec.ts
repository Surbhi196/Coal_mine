import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleMapingComponent } from './vehicle-maping.component';

describe('VehicleMapingComponent', () => {
  let component: VehicleMapingComponent;
  let fixture: ComponentFixture<VehicleMapingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VehicleMapingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleMapingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
