import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { PatientService } from '../patient.service';
import { Patient } from '../patients.model';
import { PatientLocation } from '../patient/location.model';

@Component({
  selector: 'app-e-triage-details',
  templateUrl: './e-triage-details.page.html',
  styleUrls: ['./e-triage-details.page.scss'],
})
export class ETriageDetailsPage implements OnInit {
  patient: Patient;
  isLoading = false;
  patientId: string;
  private patientSubscription: Subscription;
  pLocation: PatientLocation;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private patientSrvc: PatientService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router) { }

    ngOnInit() {
      this.route.paramMap.subscribe(paramMap => {
        if (!paramMap.has('id')) {
          this.navCtrl.navigateBack('/create');
          return;
        }
        this.isLoading = true;
        //this.patientId = paramMap.get('id');
        this.patientSubscription = this.patientSrvc.getTriagePatient(paramMap.get('id')).subscribe(patient => {
          this.patient = patient;
          this.isLoading = false;
        }, error => {
          this.alertCtrl.create({
            header: 'An error occures',
            message: 'Could not load patient.',
            buttons: [
              {
                text: 'Okay',
                handler:()=> {
                this.router.navigate(['/list']);
              }
            }
          ]
          })
          .then(alertEl => alertEl.present());
        }
      );
    });
  }

  location() {

  }

  onComplete(id: string) {
    this.loadingCtrl.create({message: 'Completing form and updating triage list'}).then(loadingEl => {
      loadingEl.present();
      this.patientSrvc.completeTriage(id).subscribe(() => {
        loadingEl.dismiss(), 2000;
        this.router.navigate(['/e-triage']);
      });
    });
  }

    ngOnDestroy() {
      if (this.patientSubscription) {
        this.patientSubscription.unsubscribe();
      }
    }
  }