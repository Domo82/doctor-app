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
}

export enum SearchType {
  all = '',
  surname = 'surname',
  // rfid = 'rfid',
   //id = 'id',
  //name = 'name'
  movie = 'movie',
  series = 'series',
  episode = 'episode'
}


@Injectable({
  providedIn: 'root'
})
export class PatientService implements AutoCompleteModule{

  url = 'https://medi-comm-d1778.firebaseio.com/patients.json';
  //url = 'http://www.omdbapi.com/';
  apiKey = 'AIzaSyBpqn2LpO8UJe8SSIJneQuPLikA_WilPpA';
  //AIzaSyDncd1aUlmEf3CS6SxZPWuPNmEzBRGcwlw
  //apiKey = 'e18ea211'

  private _patients = new BehaviorSubject<Patient[]>([]);

  get patients() {
    return this._patients.asObservable();
  }

  public filterPatient: any = [];

  constructor(
    private authService: AuthService,
    private http: HttpClient) {

      // this.filterPatient = [
      //   {
      //     firstName: "Dominic",
      //     secondName: "Dillon",
      //     RFID: "39384710",
      //     EIRCODE: "D05 YA44",
      //     drug: "NA",
      //     Surgery: "NA",
      //     allergy: "NA"
      //   },
      //   {
      //     firstName: "Patrick",
      //     secondName: "Bradley",
      //     RFID: "38453942",
      //     EIRCODE: "W23 V2P2",
      //     drug: "NA",
      //     Surgery: "Last Hair Cut",
      //     allergy: "NA"
      //   },
      //   {
      //     firstName: "Graham",
      //     secondName: "Farrell",
      //     RFID: "37792934",
      //     EIRCODE: "B45 V2P2",
      //     drug: "Lots",
      //     Surgery: "Crazy steel bars in his toes",
      //     allergy: "Tom Colgan"
      //   },
      //   {
      //     firstName: "Graham",
      //     secondName: "Farrell",
      //     RFID: "37792934",
      //     EIRCODE: "B23 T4Y9",
      //     drug: "Lots",
      //     Surgery: "Definitely needs it",
      //     allergy: "Work"
      //   }
      // ];
    }

    getRemoteData() {
      console.log(this.http.get('https://medi-comm-d1778.firebaseio.com/patients.json'));
    }

    searchData(surname: string, type: SearchType): Observable<any> {
      return this.http.get<Observable<any>>(`${this.url}?s=${encodeURI(surname)}&type=${type}&apikey=${this.apiKey}`).pipe(
        map(results => {
          console.log('RAW: ', results);
          return results['Search'];
        })
      );
    }

    getDetails(surname: string): Observable<any> {
      return this.http.get(`${this.url}?i=${surname}&plot=full&apikey=${this.apiKey}`).pipe(
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
                  resData[key].locationFound
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
            resData[key].locationFound
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
          resData[key].locationFound
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
          patientData.locationFound
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
          patientData.locationFound
           )
      })
    );
  }

  uploadImage(image: File) {
    const uploadData = new FormData();
    uploadData.append('image', image);

    return this.http.post<{imageUrl: string, imagePath: string}>('https://us-central1-medi-comm-d1778.cloudfunctions.net/storeImage', uploadData);
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
    priority

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
          locationFound
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
      priority
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
            locationFound
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
      priority
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
            oldPatient.locationFound
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
      priority: number
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
            locationFound
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
