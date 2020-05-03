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

  term = '';
  filterData = [
    {
      address : "138 Ballyshannon",
      allergies : "na",
      creatorId : "Dr Dillon",
      creatorName : "12345",
      dateOfBirth : "1993-01-28T18:16:29.992Z",
      drugHistory : "insulin ",
      emergencyContact1 : 123,
      emergencyContact2 : 456,
      emergencyContact3 : 789,
      forename : "Teresa",
      imageUrl : "/assets/images/newuser.png",
      medicalHistory : "Heart Condition,\nDiabetes\n",
      rfid : 38453942,
      surname : "Dillon"
    },
     {
      address : "22 Main Street",
      allergies : "na",
      creatorId : "12345",
      creatorName : "Dr Dillon",
      dateOfBirth : "1982-02-01T10:39:10.351Z",
      drugHistory : "na",
      emergencyContact1 : 9,
      emergencyContact2 : 98,
      emergencyContact3 : 87,
      forename : "Jane!!!",
      imageUrl : "/assets/images/newuser.png",
      medicalHistory : "na",
      rfid : 37792934,
      surname : "Doe"
    },
     {
      address : "Dublin",
      allergies : "na",
      creatorId : "Dr Dillon",
      creatorName : "12345",
      dateOfBirth : "1987-02-01T11:28:42.592Z",
      drugHistory : "na",
      emergencyContact1 : 123,
      emergencyContact2 : 321,
      emergencyContact3 : 456,
      forename : "Peter",
      imageUrl : "/assets/images/newuser.png",
      medicalHistory : "na",
      rfid : 39384710,
      surname : "Pan"
    },
     {
      address : "bray",
      allergies : "na",
      creatorId : "Dr Dillon",
      creatorName : "12345",
      dateOfBirth : "1984-02-08T13:45:04.329Z",
      drugHistory : "na",
      emergencyContact1 : 12,
      emergencyContact2 : 12,
      emergencyContact3 : 12,
      forename : "Graham",
      imageUrl : "/assets/images/newuser.png",
      medicalHistory : "na",
      rfid : 74673742,
      surname : "Farrell"
    },
     {
      address : "Springfield",
      allergies : "na",
      creatorId : "Dr Dillon",
      creatorName : "12345",
      dateOfBirth : "1984-03-01T17:19:34.735Z",
      drugHistory : "na",
      emergencyContact1 : 1,
      emergencyContact2 : 2,
      emergencyContact3 : 3,
      forename : "Homer",
      imageUrl : "/assets/images/newuser.png",
      medicalHistory : "na",
      rfid : 96968364,
      surname : "Simpson"
    },
     {
      "address" : "street",
      "allergies" : "na",
      "creatorId" : "Dr Dillon",
      "creatorName" : "12345",
      "dateOfBirth" : "1968-03-01T19:37:31.945Z",
      "drugHistory" : "na",
      "emergencyContact1" : 1,
      "emergencyContact2" : 2,
      "emergencyContact3" : 3,
      "forename" : "bruce",
      "imageUrl" : "/assets/images/newuser.png",
      "medicalHistory" : "na",
      "rfid" : 97003148,
      "surname" : "almighty"
    }
  ]

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

  // searchChanged() {
  //   //this.results = this.patientService.fetchPatient();
  //   this.results = this.patientSrvc.searchData(this.searchTerm, this.type);
  //   // this.results.subscribe(res => {
  //   // })
  // }

}
