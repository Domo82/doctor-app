import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay } from 'rxjs/operators';

import { Patient } from './patients.model';
import { AuthService } from './auth/auth.service';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private _patients = new BehaviorSubject<Patient[]>([
    new Patient(
      '112233',
      'Dominic',
      'Dillon',
       new Date('05-12-1982'),
      'A1234',
      '123 fake street',
      'none',
      'none',
      'none',
      '0871234567',
      '0861234567',
      '0881234567',
      '/assets/images/baymax.png',
      'Dr Dillon',
      '12345'
      ),
    new Patient(
      '445566',
      'Karina',
      'Dillon',
      new Date('12-02-1985'),
      'B567 8',
      '123 fake street',
      'none',
      'none',
      'none',
      '0871234567',
      '0861234567',
      '0881234567',
      '/assets/images/woody.png',
      'Dr Dillon',
      '12345'
      ),
    new Patient(
      '778899',
      'Zoe',
      'Dillon',
      new Date('20-02-2019'),
      'C8901',
      '123 fake street',
      'none',
      'none',
      'none',
      '0871234567',
      '0861234567',
      '0881234567',
      '/assets/images/forky.png',
      'Dr Dillon',
      '12345'
      )
  ]);

  get patients() {
    return this._patients.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) { }

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
    imageUrl: string ) {
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
        return this.http.post('https://medi-comm-d1778.firebaseio.com/patients.json',
          { ...newPatient, id: null}).pipe(tap(resData => {
            console.log(resData);
          })
        );
      //   return this.patients.pipe(
      //     take(1),
      //     delay(1000),
      //     tap(patients => {
      //       this._patients.next(patients.concat(newPatient));
      //   })
      // );
    };

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
      return this.patients.pipe(
        take(1),
        delay(1500),
        tap(patients => {
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
          this._patients.next(updatedPatients);
        })
      );
    }
}
