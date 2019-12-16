import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { PatientService } from '../patient.service';

import { Patient } from '../patients.model';


@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit, OnDestroy {
  patient: Patient;
  private patientSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private patientSrvc: PatientService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navCtrl.navigateBack('/create');
        return;
      }
      this.patientSubscription = this.patientSrvc.getPatient(paramMap.get('id')).subscribe(patient => {
        this.patient = patient;
      });
    });
  }
  ngOnDestroy() {
    if (this.patientSubscription) {
      this.patientSubscription.unsubscribe();
    }
  }
}
