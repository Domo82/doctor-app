import { Component, OnInit } from '@angular/core';

import { Patient } from '../patients.model';
import { PatientService } from '../patient.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  patient: Patient;

  constructor(
    private patientSrvc: PatientService,
    private route: ActivatedRoute,
    private navCtrl: NavController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navCtrl.navigateBack('/create');
        return;
      }
      this.patient = this.patientSrvc.getPatient(paramMap.get('id'));
    });
  }

}
