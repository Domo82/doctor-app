import { Component, OnInit  } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PatientService, SearchType } from './../patient.service';
import { Observable } from 'rxjs';
import { Key } from 'protractor';
import { map, switchMap } from 'rxjs/operators';
import { FormGroup, Validators, FormControl } from '@angular/forms'
import { Subscription } from 'rxjs';
import { Patient } from '../patients.model';



@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  

  loadedPatients: Patient[];
  private patientsSubscription: Subscription;
  results: Observable<any>;
  searchTerm = '';
  type: SearchType = SearchType.all;

  constructor(private patientSrvc: PatientService, public navCtrl: NavController){
  }

  ionViewDidLoad() {
    this.patientSrvc.getRemoteData();
  }


  ngOnInit() {
  }

  searchChanged() {
    //this.results = this.patientService.fetchPatient();
    this.results = this.patientSrvc.searchData(this.searchTerm, this.type);
    // this.results.subscribe(res => {
    // })
  }

}
