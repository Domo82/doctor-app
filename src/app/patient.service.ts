import { Injectable } from '@angular/core';
//import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { AutoCompleteService } from 'ionic4-auto-complete';
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
  emergencyContact3: string;
  forename: string;
  imageUrl: string;
  locationFound: string,
  medicalHistory: string;
  pps: string;
  surname: string;
}

export enum SearchType {
  all = '',
  movie = 'movie',
  series = 'series',
  episode = 'episode'
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private _patients = new BehaviorSubject<Patient[]>([]);
  // url = 'https://medi-comm-d1778.firebaseio.com/patients.json';
  url = 'https://medi-comm-d1778.firebaseio.com/patients.json';
  apiKey = 'AIzaSyBpqn2LpO8UJe8SSIJneQuPLikA_WilPpA';

  labelAttribute = 'name';

  private users: any[] = [];


  get patients() {
    return this._patients.asObservable();
  }

  constructor(
    private authService: AuthService,
    private http: HttpClient) { }

    SearchData(id: string, type: SearchType): Observable<any> {
      return this.http.get(`${this.url}?s=${encodeURI(id)}&type=${type}&apikey=${this.apiKey}`).pipe(
        map(results => results['Search'])
      );
    }

    getDetails(id) {
      return this.http.get(`${this.url}?i=${id}&plot=full&apikey=${this.apiKey}`);
    }

    // getPatient(id: string) {
  //   return this.patients.pipe(
  //     take(1),
  //     map(patients => {
  //       return { ...patients.find(p => p.id === id)};
  //     })
  //   );
  // }


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
          new Date(patientData.dateOfBirth),
          patientData.pps,
          patientData.address,
          patientData.medicalHistory,
          patientData.drugHistory,
          patientData.allergies,
          patientData.emergencyContact1,
          patientData.emergencyContact2,
          patientData.emergencyContact3,
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
    pps: string,
    address: string,
    medicalHistory: string,
    drugHistory: string,
    allergies: string,
    emergencyContact1: string,
    emergencyContact2: string,
    emergencyContact3: string,
    imageUrl: string,
    locationFound: string
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
        imageUrl,
        // fetch creator from auth service
        this.authService.creatorId,
        this.authService.creatorName,
        locationFound
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

    // updatePatient(
    //   id: string,
    //   forename: string,
    //   surname: string,
    //   address: string,
    //   medicalHistory: string,
    //   drugHistory: string,
    //   allergies: string,
    //   emergencyContact1: string,
    //   emergencyContact2: string,
    //   emergencyContact3: string,
    //   locationFound: string
    //   ){
    //     let updatedPatients: Patient[];
    //     return this.patients.pipe(
    //       take(1),
    //       switchMap(patients => {
    //         if (!patients || patients.length <= 0) {
    //           return this.fetchPatient();
    //         } else {
    //           return of(patients);
    //         }
    //     }),
    //     switchMap(patients => {
    //       if (!patients || patients.length <=0) {
    //         return this.fetchPatient();
    //       } else {
    //         return of(patients);
    //       }
    //     }),
    //     switchMap(patients => {
    //       const updatedPatientIndex = patients.findIndex(pat => pat.id === id);
    //       const updatedPatients = [...patients];
    //       const oldPatient = updatedPatients[updatedPatientIndex];
    //       updatedPatients[updatedPatientIndex] = new Patient(
    //         oldPatient.id,
    //         forename,
    //         surname,
    //         oldPatient.dateOfBirth,
    //         oldPatient.pps,
    //         address,
    //         medicalHistory,
    //         drugHistory,
    //         allergies,
    //         emergencyContact1,
    //         emergencyContact2,
    //         emergencyContact3,
    //         oldPatient.imageUrl,
    //         oldPatient.creatorId,
    //         oldPatient.creatorName,
    //         locationFound
    //         );
    //       return this.http.post(`https://medi-comm-d1778.firebaseio.com/patients/${id}.json`,
    //       {...updatedPatients[updatedPatientIndex], id:null }
    //       );
    //     }),
    //     tap(() => {
    //       this._patients.next(updatedPatients);
    //     })
    //   );
    // }

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
      locationFound: string
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
            oldPatient.creatorName,
            locationFound
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
      emergencyContact3: string,
      locationFound: string
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
            oldPatient.creatorName,
            locationFound
            );
          return this.http.post(`https://events-1ebb1.firebaseio.com/events/${id}.json`,
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

    // search() {
    //   let self = this;
    //   self.results = self.afs.collection(`patients`, ref => ref
    //     .orderBy("forename")
    //     .startAt(self.searchValue.toLowerCase())
    //     .endAt(self.searchValue.toLowerCase()+"\uf8ff")
    //     .limit(2))
    //     .valueChanges();
    // }


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
