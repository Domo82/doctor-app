import { Component, OnInit } from '@angular/core';

import { PatientService } from '../patient.service';
import { Patient } from '../patients.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  loadedPatients: Patient[];

  constructor(private patientSrvc: PatientService) { }

  ngOnInit() {
    this.loadedPatients = this.patientSrvc.patients;
  }

}
