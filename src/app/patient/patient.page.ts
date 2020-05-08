import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { FormGroup , FormControl, Validators} from '@angular/forms';
import { Subscription } from 'rxjs';

import { Patient } from '../patients.model';
import { PatientService } from '../patient.service';
import { PatientLocation } from './location.model';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.page.html',
  styleUrls: ['./patient.page.scss'],
})
export class PatientPage implements OnInit, OnDestroy {
  patient: Patient;
  patientId: string;
  form: FormGroup;
  isLoading = false;
  private patientSubscription: Subscription;

  constructor(
    private patientSrvc: PatientService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navCtrl.navigateBack('/edit');
        return;
      }
      this.isLoading = true;
      this.patientSubscription =  this.patientSrvc
      .getPatient(paramMap.get('id'))
      .subscribe(
        patient => {
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
          // dateOfBirth: new FormControl(null, {
          //   updateOn: 'blur',
          //   validators: [Validators.required]
          // }),
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
          rfidNumber: new FormControl(this.patient.rfidNumber, {
            updateOn: 'blur',
            validators: [Validators.maxLength(10)]
          }),
          hospital: new FormControl(this.patient.hospital, {
            updateOn: 'blur',
            validators: [Validators.maxLength(20), Validators.required]
          }),
          surgeryHistory: new FormControl(this.patient.surgeryHistory, {
            updateOn: 'blur',
            validators: [Validators.maxLength(20), Validators.required]
          }),
          locationFound: new FormControl(null, {validators: [Validators.required]})
        });
        this.isLoading = false;
      }, error => {
        this.alertCtrl
        .create({
          header: 'An error occurred!',
          message: 'Patient could not be fetched. Please try again later.',
          buttons: [
            {
            text: 'Okay',
            handler: () => {
            this.router.navigate(['/list']);
          }
        }
      ]
      })
      .then(alertEl => {
        alertEl.present();
      });
      }
    );
  });
}
  // ionViewWillEnter() {
  //   this.isLoading = true;
  //   this.patientSrvc.fetchPatient().subscribe(() => {
  //     this.isLoading = false;
  //   });
  // }


  onLocationPicked(locationFound: PatientLocation) {
    this.form.patchValue({locationFound: locationFound});
  }

  onSendDetails() {
    if(!this.form.valid) {
      return;
    }
    this.loadingCtrl
    .create({
      message: 'Sending Patient Details...'
    })
    .then(loadingEl => {
      loadingEl.present();
      this.patientSrvc
      .sendPatientEvent(
        this.patient.id,
        this.form.value.forename,
        this.form.value.surname,
        this.form.value.address,
        this.form.value.medicalHistory,
        this.form.value.drugHistory,
        this.form.value.allergies,
        this.form.value.emergencyContact1,
        this.form.value.emergencyContact2,
        this.form.value.rfidNumber,
        this.form.value.locationFound,
        this.form.value.hospital,
        this.form.value.surgeryHistory

      ).subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['/list']);
        this.alertCtrl
        .create({
          header: 'Patient data sent to the e-Triage service',
          message: 'Patients data has been sent to the Medi-Comm e-triage service center.',
          buttons: [
            {
            text: 'Okay'
          //   handler: () => {
          //   this.router.navigate(['/list']);
          // }
        }
      ]
      })
      .then(alertEl => {
        alertEl.present();
      });
      console.log(this.patientSrvc)
      });
    });
  }

  ngOnDestroy() {
    if (this.patientSubscription) {
      this.patientSubscription.unsubscribe();
    }
  }

}