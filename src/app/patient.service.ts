import { Injectable } from '@angular/core';

import { Patient } from './patients.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  // tslint:disable-next-line: variable-name
  private _patients: Patient[] = [
    new Patient(
      'p1',
      '123456M',
      'Dominic Dillon',
      '/assets/images/baymax.png'
      ),
    new Patient(
      'p2',
      '789102M',
      'Karina Dillon',
      '/assets/images/woody.png'
      ),
    new Patient(
      'p3',
      '9876543M',
      'Zoe Dillon',
      '/assets/images/forky.png'
      )
  ];

  get patients() {
    return [...this._patients];
  }

  constructor() { }
}
