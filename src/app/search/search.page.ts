import { Component, OnInit  } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PatientService, SearchType } from './../patient.service';
import { Observable } from 'rxjs';
import { Key } from 'protractor';
import { FormGroup, Validators, FormControl } from '@angular/forms'



@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  results: Observable<any>;
  searchTerm: string = '';
  type: SearchType = SearchType.all;


  constructor(private patientService: PatientService, public navCtrl: NavController){

  }

  ngOnInit() {}

  searchChanged() {
    this.results = this.patientService.fetchPatient();
  }

}
