import { Injectable } from '@angular/core';
//import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { BehaviorSubject, of, Observable, observable } from 'rxjs';

import { take, map, tap, delay, switchMap, toArray } from 'rxjs/operators';
import { AutoCompleteModule } from 'ionic4-auto-complete';
import { PatientLocation } from './patient/location.model';

import { Patient } from './patients.model';
import { AuthService } from './auth/auth.service';
import { HttpClient } from '@angular/common/http';
// import { type } from 'os';

interface PatientData{
  address: string;
  allergies: string;
  creatorId: string;
  creatorName: string;
  dateOfBirth: string;
  drugHistory: string;
  emergencyContact1: string;
  emergencyContact2: string;
  rfidNumber: string;
  forename: string;
  imageUrl: string;
  locationFound: PatientLocation,
  medicalHistory: string;
  rfid: string;
  surname: string;
  hospital: string;
  surgeryHistory: string;
}

export enum SearchType {
  all = '',
  surname = 'surname',
  rfid = 'rfid',
  id = 'id',
  forename = 'name'
}


@Injectable({
  providedIn: 'root'
})
export class PatientService implements AutoCompleteModule{

  url = 'https://medi-comm-d1778.firebaseio.com/patients.json';
  apiKey = 'AIzaSyBpqn2LpO8UJe8SSIJneQuPLikA_WilPpA';

  private _patients = new BehaviorSubject<Patient[]>([]);

  get patients() {
    return this._patients.asObservable();
  }

  public filterPatient: any = [];

  constructor(
    private authService: AuthService,
    private http: HttpClient) {

    }

    getRemoteData() {
      console.log(this.http.get('https://medi-comm-d1778.firebaseio.com/patients.json'));
    }

    searchData(rfidNumber: string, type: SearchType): Observable<any> {
      return this.http.get<Observable<any>>(`${this.url}?s=${encodeURI(rfidNumber)}&type=${type}&apikey=${this.apiKey}`).pipe(
        map(results => {
          console.log('RAW: ', results);
          return results['Search'];
        })
      );
    }

    getDetails(forename: string): Observable<any> {
      return this.http.get(`${this.url}?i=${forename}&plot=full&apikey=${this.apiKey}`).pipe(
        map(resData => {
          const patients = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              patients.push(
                new Patient(
                  key,
                  resData[key].forename,
                  resData[key].surname,
                  resData[key].dateOfBirth,
                  resData[key].rfid,
                  resData[key].address,
                  resData[key].medicalHistory,
                  resData[key].drugHistory,
                  resData[key].allergies,
                  resData[key].emergencyContact1,
                  resData[key].emergencyContact2,
                  resData[key].rfidNumber,
                  resData[key].imageUrl,
                  resData[key].creatorName,
                  resData[key].creatorId,
                  resData[key].locationFound,
                  resData[key].hospital,
                  resData[key].surgeryHistory
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


  // fetch our existing patients from patients db with http GET request
  fetchPatient() {
    return this.http
    .get<{[key:string]: PatientData }>('https://medi-comm-d1778.firebaseio.com/patients.json'
    )
    .pipe(
      map(resData => {
      const patients = [];
      for (const key in resData) {
        if (resData.hasOwnProperty(key)) {
          patients.push(
            new Patient(
            key,
            resData[key].forename,
            resData[key].surname,
            resData[key].dateOfBirth,
            resData[key].rfid,
            resData[key].address,
            resData[key].medicalHistory,
            resData[key].drugHistory,
            resData[key].allergies,
            resData[key].emergencyContact1,
            resData[key].emergencyContact2,
            resData[key].rfidNumber,
            resData[key].imageUrl,
            resData[key].creatorName,
            resData[key].creatorId,
            resData[key].locationFound,
            resData[key].hospital,
            resData[key].surgeryHistory

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

 // fetch our existing patient event from the events db with http GET request
 fetchPatientEvent() {
  return this.http
  .get<{[key:string]: PatientData }>('https://events-1ebb1.firebaseio.com/events.json'
  )
  .pipe(
    map(resData => {
    const patients = [];
    for (const key in resData) {
      if (resData.hasOwnProperty(key)) {
        patients.push(
          new Patient(
          key,
          resData[key].forename,
          resData[key].surname,
          resData[key].dateOfBirth,
          resData[key].rfid,
          resData[key].address,
          resData[key].medicalHistory,
          resData[key].drugHistory,
          resData[key].allergies,
          resData[key].emergencyContact1,
          resData[key].emergencyContact2,
          resData[key].rfidNumber,
          resData[key].imageUrl,
          resData[key].creatorName,
          resData[key].creatorId,
          resData[key].locationFound,
          resData[key].hospital,
          resData[key].surgeryHistory
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
    return this.http
    .get<PatientData>(`https://medi-comm-d1778.firebaseio.com/patients/${id}.json`
    )
    .pipe(
      map(patientData => {
        return new Patient(
          id,
          patientData.forename,
          patientData.surname,
          patientData.dateOfBirth,
          patientData.rfid,
          patientData.address,
          patientData.medicalHistory,
          patientData.drugHistory,
          patientData.allergies,
          patientData.emergencyContact1,
          patientData.emergencyContact2,
          patientData.rfidNumber,
          patientData.imageUrl,
          patientData.creatorName,
          patientData.creatorId,
          patientData.locationFound,
          patientData.hospital,
          patientData.surgeryHistory
           )
      })
    );
  }

  getTriagePatient(id: string) {
    return this.http
    .get<PatientData>(`https://events-1ebb1.firebaseio.com/events/${id}.json`
    )
    .pipe(
      map(patientData => {
        return new Patient(
          id,
          patientData.forename,
          patientData.surname,
          patientData.dateOfBirth,
          patientData.rfid,
          patientData.address,
          patientData.medicalHistory,
          patientData.drugHistory,
          patientData.allergies,
          patientData.emergencyContact1,
          patientData.emergencyContact2,
          patientData.rfidNumber,
          patientData.imageUrl,
          patientData.creatorName,
          patientData.creatorId,
          patientData.locationFound,
          patientData.hospital,
          patientData.surgeryHistory
           )
      })
    );
  }

  uploadImage(image: File) {
    const uploadData = new FormData();
    uploadData.append('image', image);
    return this.http.post<{imageUrl: string, imagePath: string}>(
      'https://us-central1-medi-comm-d1778.cloudfunctions.net/storeImage',
      uploadData);
  }

  addPatient(
    forename: string,
    surname: string,
    dateOfBirth: Date,
    rfid: string,
    address: string,
    medicalHistory: string,
    drugHistory: string,
    allergies: string,
    emergencyContact1: string,
    emergencyContact2: string,
    rfidNumber: string,
    imageUrl: string,
    locationFound: PatientLocation,
    hospital: string,
    surgeryHistory: string
    ) {
      let generatedId: string;
      let newPatient: Patient;
      return this.authService.userId.pipe(
        take(1),
        switchMap(userId => {
        if (!userId) {
          throw new Error('No user found!');
        }
        newPatient = new Patient(
          Math.random().toString(),
          forename,
          surname,
          dateOfBirth.toDateString(),
          rfid,
          address,
          medicalHistory,
          drugHistory,
          allergies,
          emergencyContact1,
          emergencyContact2,
          rfidNumber,
          imageUrl,
          // fetch creator from auth service
          userId,
          this.authService.creatorName,
          locationFound,
          hospital,
          surgeryHistory
          );
          return this.http
          .post<{name : string}>('https://medi-comm-d1778.firebaseio.com/patients.json',{
             ...newPatient,
             id: null})
          }),
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
    }

    addTriagePatient(
      forename: string,
      surname: string,
      dateOfBirth: Date,
      rfid: string,
      address: string,
      medicalHistory: string,
      drugHistory: string,
      allergies: string,
      emergencyContact1: string,
      emergencyContact2: string,
      rfidNumber: string,
      imageUrl: string,
      locationFound: PatientLocation,
      hospital: string,
      surgeryHistory: string
      ) {
        let generatedId: string;
        let newPatient: Patient;
        return this.authService.userId.pipe(take(1), switchMap(userId => {
          if (!userId) {
            throw new Error('No user found');
          }
          newPatient = new Patient(
            Math.random().toString(),
            forename,
            surname,
            dateOfBirth.toDateString(),
            rfid,
            address,
            medicalHistory,
            drugHistory,
            allergies,
            emergencyContact1,
            emergencyContact2,
            rfidNumber,
            imageUrl,
            // fetch creator from auth service
            userId,
            this.authService.creatorName,
            locationFound,
            hospital,
            surgeryHistory
            );
            return this.http
            .post<{name : string}>('https://events-1ebb1.firebaseio.com/events.json',{
               ...newPatient,
               id: null
              }
            )
        }),
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
      rfidNumber: string,
      locationFound: string,
      hospital: string,
      surgeryHistory: string
      ){
        let updatedPatients: Patient[];
        return this.patients.pipe(
          take(1),
          switchMap(patients => {
            if (!patients || patients.length <= 0) {
              return this.fetchPatient();
            } else {
              return of(patients);
            }
        }),
        switchMap(patients => {
          if (!patients || patients.length <=0) {
            return this.fetchPatient();
          } else {
            return of(patients);
          }
        }),
        switchMap(patients => {
          const updatedPatientIndex = patients.findIndex(pat => pat.id === id);
          const updatedPatients = [...patients];
          const oldPatient = updatedPatients[updatedPatientIndex];
          updatedPatients[updatedPatientIndex] = new Patient(
            oldPatient.id,
            forename,
            surname,
            oldPatient.dateOfBirth,
            oldPatient.rfid,
            address,
            medicalHistory,
            drugHistory,
            allergies,
            emergencyContact1,
            emergencyContact2,
            rfidNumber,
            oldPatient.imageUrl,
            oldPatient.userId,
            oldPatient.creatorName,
            oldPatient.locationFound,
            hospital,
            surgeryHistory
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


    sendPatientEvent(
      id: string,
      forename: string,
      surname: string,
      address: string,
      medicalHistory: string,
      drugHistory: string,
      allergies: string,
      emergencyContact1: string,
      emergencyContact2: string,
      rfidNumber: string,
      locationFound: PatientLocation,
      hospital: string,
      surgeryHistory: string
      ){
        let updatedPatients: Patient[];
        return this.patients.pipe(
          take(1),
          switchMap(patients => {
            if (!patients || patients.length <= 0) {
              return this.fetchPatient();
            } else {
              return of(patients);
            }
        }),
        switchMap(patients => {
          if (!patients || patients.length <=0) {
            return this.fetchPatient();
          } else {
            return of(patients);
          }
        }),
        switchMap(patients => {
          const updatedPatientIndex = patients.findIndex(pat => pat.id === id);
          const updatedPatients = [...patients];
          const oldPatient = updatedPatients[updatedPatientIndex];
          updatedPatients[updatedPatientIndex] = new Patient(
            oldPatient.id,
            forename,
            surname,
            oldPatient.dateOfBirth,
            oldPatient.rfid,
            address,
            medicalHistory,
            drugHistory,
            allergies,
            emergencyContact1,
            emergencyContact2,
            rfidNumber,
            oldPatient.imageUrl,
            oldPatient.userId,
            oldPatient.creatorName,
            locationFound,
            hospital,
            surgeryHistory
            );
          return this.http.post(`https://events-1ebb1.firebaseio.com/events.json`,
          {...updatedPatients[updatedPatientIndex], id:null }
          );
        }),
        tap(() => {
          this._patients.next(updatedPatients);
        })
      );
    }

    completeTriage(id: string) {
      return this.http
      .delete(
        `https://events-1ebb1.firebaseio.com/events/${id}.json`
        ).pipe(
          switchMap(() => {
            return this.patients;
          }),
          take(1),tap(patients => {
            this._patients.next(patients.filter(p => p.id !== id));
          })
        );
    }

    deletePatient(id: string) {
      return this.http
      .delete(
        `https://medi-comm-d1778.firebaseio.com/patients/${id}.json`
        ).pipe(
          switchMap(() => {
            return this.patients;
          }),
          take(1),tap(patients => {
            this._patients.next(patients.filter(p => p.id !== id));
          })
        );
    }
}
