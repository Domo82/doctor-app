import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { PatientService } from '../patient.service';
import { Patient } from '../patients.model';
import { Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-e-triage',
  templateUrl: './e-triage.page.html',
  styleUrls: ['./e-triage.page.scss'],
})
export class ETriagePage implements OnInit, OnDestroy{

  loadedPatients: Patient[];
  private patientsSubscription: Subscription;
  isLoading = false;

  constructor(private patientSrvc: PatientService, private router: Router) { }

  ngOnInit() {
    this.patientsSubscription = this.patientSrvc.patients.subscribe(patientList => {
      this.loadedPatients = patientList;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.patientSrvc.fetchPatientEvent().subscribe(() => {
      this.isLoading = false;
    });
  }

  onCompleteTriage(patientId: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    // complete triage call with patientId
  }

  ngOnDestroy() {
    if (this.patientsSubscription) {
      this.patientsSubscription.unsubscribe();
    }
  }

}
