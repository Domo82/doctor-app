import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
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
  isLoading = false;
  patientId: string;
  private patientSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private patientSrvc: PatientService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navCtrl.navigateBack('/create');
        return;
      }
      this.isLoading = true;
      //this.patientId = paramMap.get('id');
      this.patientSubscription = this.patientSrvc.getPatient(paramMap.get('id')).subscribe(patient => {
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
  ngOnDestroy() {
    if (this.patientSubscription) {
      this.patientSubscription.unsubscribe();
    }
  }
}
