import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FormGroup , FormControl, Validators} from '@angular/forms';
import { Subscription } from 'rxjs';

import { Patient } from '../patients.model';
import { PatientService } from '../patient.service';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit, OnDestroy {
  patient: Patient;
  form: FormGroup
  private patientSubscription: Subscription;

  constructor(
    private patientSrvc: PatientService,
    private route: ActivatedRoute,
    private navCtrl: NavController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navCtrl.navigateBack('/edit');
        return;
      }
      this.patientSubscription =  this.patientSrvc.getPatient(paramMap.get('id')).subscribe(patient => {
        this.patient = patient;
        this.form = new FormGroup({
          forename: new FormControl(this.patient.forename, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.maxLength(50)]
          }),
          surname: new FormControl(this.patient.surname, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.maxLength(50)],
          }),
          address: new FormControl(this.patient.address, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.maxLength(250)]
          }),
          dateOfBirth: new FormControl(null, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          medicalHistory: new FormControl(this.patient.medicalHistory, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.maxLength(2500)]
          }),
          drugHistory: new FormControl(this.patient.drugHistory, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.maxLength(2500)]
          }),
          allergies: new FormControl(this.patient.allergies, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.maxLength(2500)]
          }),
          emergencyContact1: new FormControl(this.patient.emergencyContact1, {
            updateOn: 'blur',
            validators: [Validators.maxLength(10)]
          }),
          emergencyContact2: new FormControl(this.patient.emergencyContact2, {
            updateOn: 'blur',
            validators: [Validators.maxLength(10)]
          }),
          emergencyContact3: new FormControl(this.patient.emergencyContact3, {
            updateOn: 'blur',
            validators: [Validators.maxLength(10)]
          })
        });
      });
    });     
  }

  onUpdateDetails() {
    if(!this.form.valid) {
      return;
    }
    console.log(this.form);
  }

  ngOnDestroy() {
    if (this.patientSubscription) {
      this.patientSubscription.unsubscribe();
    }
  }

}
