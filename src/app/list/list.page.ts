import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { PatientService } from '../patient.service';
import { Patient } from '../patients.model';


@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit, OnDestroy {
  loadedPatients: Patient[];
  private patientsSubscription: Subscription;

  constructor(private patientSrvc: PatientService) { }

  ngOnInit() {
    this.patientsSubscription = this.patientSrvc.patients.subscribe(patientList => {
      this.loadedPatients = patientList;
    });
  }
  ngOnDestroy() {
    if (this.patientsSubscription) {
      this.patientsSubscription.unsubscribe();
    }
  }

}
