import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';

import { Patient } from './patients.model';
import { AuthService } from './auth/auth.service';
import { HttpClient } from '@angular/common/http';

interface PatientData{
  address:  string;
  allergies: string;
  creatorId: string;
  creatorName: string;
  dateOfBirth: string;
  drugHistory: string;
  emergencyContact1: string;
  emergencyContact2: string;
  emergencyContact3: string;
  forename: string;
  imageUrl: string;
  medicalHistory: string;
  pps: string;
  surname: string;
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private _patients = new BehaviorSubject<Patient[]>([]);

  get patients() {
    return this._patients.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) { }

  // fetch our existing places with http GET request
  fetchPlaces() {
    return this.http.get<{ [key : string]: PatientData }>('https://medi-comm-d1778.firebaseio.com/patients.json')
    .pipe(map(resData => {
      const patients = [];
      for (const key in resData) {
        if (resData.hasOwnProperty(key)) {
          patients.push(new Patient(
            key,
            resData[key].forename,
            resData[key].surname,
            new Date (resData[key].dateOfBirth),
            resData[key].pps,
            resData[key].address,
            resData[key].medicalHistory,
            resData[key].drugHistory,
            resData[key].allergies,
            resData[key].emergencyContact1,
            resData[key].emergencyContact2,
            resData[key].emergencyContact3,
            resData[key].imageUrl,
            resData[key].creatorName,
            resData[key].creatorId
            )
          );
        }
      }
      return patients;
      //return[];
    }),
    tap(patients => {
      this._patients.next(patients);
    })
    );
  }

  getPatient(id: string) {
    return this.patients.pipe(
      take(1),
      map(patients => {
        return { ...patients.find(p => p.id === id)};
      })
    );
  }

  addPatient(
    forename: string,
    surname: string,
    dateOfBirth: Date,
    pps: string,
    address: string,
    medicalHistory: string,
    drugHistory: string,
    allergies: string,
    emergencyContact1: string,
    emergencyContact2: string,
    emergencyContact3: string,
    imageUrl: string
    ) {
      let generatedId: string;
      const newPatient = new Patient(
        Math.random().toString(),
        forename,
        surname,
        dateOfBirth,
        pps,
        address,
        medicalHistory,
        drugHistory,
        allergies,
        emergencyContact1,
        emergencyContact2,
        emergencyContact3,
        '/assets/images/newuser.png',
        // fetch creator from auth service
        this.authService.creatorId,
        this.authService.creatorName
        );
        return this.http
        .post<{name : string}>('https://medi-comm-d1778.firebaseio.com/patients.json',{
           ...newPatient,
           id: null})
          .pipe(
            switchMap(resData => {
              generatedId = resData.name;
              return this.patients;
            }),
            take(1),
            tap(patients => {
              newPatient.id = generatedId;
              this._patients.next(patients.concat(newPatient));
            })
        );
      //   return this.patients.pipe(
      //     take(1),
      //     delay(1000),
      //     tap(patients => {
      //       this._patients.next(patients.concat(newPatient));
      //   })
      // );
    }

    updatePatient(
      id: string,
      forename: string,
      surname: string,
      address: string,
      medicalHistory: string,
      drugHistory: string,
      allergies: string,
      emergencyContact1: string,
      emergencyContact2: string,
      emergencyContact3: string,
      ){
        let updatedPatients: Patient[];
        return this.patients.pipe(
          take(1),
          switchMap(patients => {
          const updatedPatientIndex = patients.findIndex(pat => pat.id === id);
          const updatedPatients = [...patients];
          const oldPatient = updatedPatients[updatedPatientIndex];
          updatedPatients[updatedPatientIndex] = new Patient(
            oldPatient.id,
            forename,
            surname,
            oldPatient.dateOfBirth,
            oldPatient.pps,
            address,
            medicalHistory,
            drugHistory,
            allergies,
            emergencyContact1,
            emergencyContact2,
            emergencyContact3,
            oldPatient.imageUrl,
            oldPatient.creatorId,
            oldPatient.creatorName
            );
          return this.http.put(`https://medi-comm-d1778.firebaseio.com/patients/${id}.json`,
          {...updatedPatients[updatedPatientIndex], id:null }
          );
        }),
        tap(() => {
          this._patients.next(updatedPatients);
        })
      );
    }
}


//Dummy Data

// [
//   new Patient(
//     '112233',
//     'Dominic',
//     'Dillon',
//      new Date('05-12-1982'),
//     'A1234',
//     '123 fake street',
//     'none',
//     'none',
//     'none',
//     '0871234567',
//     '0861234567',
//     '0881234567',
//     '/assets/images/baymax.png',
//     'Dr Dillon',
//     '12345'
//     ),
//   new Patient(
//     '445566',
//     'Karina',
//     'Dillon',
//     new Date('12-02-1985'),
//     'B567 8',
//     '123 fake street',
//     'none',
//     'none',
//     'none',
//     '0871234567',
//     '0861234567',
//     '0881234567',
//     '/assets/images/woody.png',
//     'Dr Dillon',
//     '12345'
//     ),
//   new Patient(
//     '778899',
//     'Zoe',
//     'Dillon',
//     new Date('20-02-2019'),
//     'C8901',
//     '123 fake street',
//     'none',
//     'none',
//     'none',
//     '0871234567',
//     '0861234567',
//     '0881234567',
//     '/assets/images/forky.png',
//     'Dr Dillon',
//     '12345'
//     )
// ]
