import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PatientService } from '../patient.service';

import { Patient } from '../patients.model';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  patient: Patient;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private patientSrvc: PatientService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('patientId')) {
        this.navCtrl.navigateBack('/create');
        return;
      }
      this.patient = this.patientSrvc.getPatient(paramMap.get('patientId'));
    });
  }
}
