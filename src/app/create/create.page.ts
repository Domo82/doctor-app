import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PatientService } from '../patient.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  form: FormGroup;

  constructor(private patientService: PatientService, private router: Router, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.form = new FormGroup({
      forename: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(50)]
      }),
      surname: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(50)]
      }),
      dateOfBirth: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      address: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(250)]
      }),
      pps: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.max(12)]
      }),
      medicalHistory: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(2500)]
      }),
      drugHistory: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(2500)]
      }),
      allergies: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(2500)]
      }),
      emergencyContact1: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.maxLength(10)]
      }),
      emergencyContact2: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.maxLength(10)]
      }),
      emergencyContact3: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.maxLength(10)]
      }),
      imageUrl: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.maxLength(10)]
      }),
    });
  }

  onCreatePatient() {
    if(!this.form.valid) {
      return;
    }
    this.loadingCtrl
    .create({
      message: 'Creating New Patient...'
    })
    .then(loadingEl => {
      loadingEl.present();
      this.patientService
      .addPatient(
        this.form.value.forename,
        this.form.value.surname,
        new Date(this.form.value.dateOfBirth),
        this.form.value.pps,
        this.form.value.address,
        this.form.value.medicalHistory,
        this.form.value.drugHistory,
        this.form.value.allergies,
        this.form.value.emergencyContact1,
        this.form.value.emergencyContact2,
        this.form.value.emergencyContact3,
        this.form.value.imageUrl
      )
      .subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['/list']);
      });
    });
  }
}
