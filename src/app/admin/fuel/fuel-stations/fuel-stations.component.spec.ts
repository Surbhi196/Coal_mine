import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelStationsComponent } from './fuel-stations.component';

describe('FuelStationsComponent', () => {
  let component: FuelStationsComponent;
  let fixture: ComponentFixture<FuelStationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FuelStationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuelStationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
