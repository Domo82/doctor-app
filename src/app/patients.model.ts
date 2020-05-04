import { PatientLocation } from './patient/location.model';

export class Patient {
    constructor(
        public id: string,
        public forename: string,
        public surname: string,
        public dateOfBirth: string = new Date().toDateString(),
        public rfid: string,
        public address: string,
        public medicalHistory: string,
        public drugHistory: string,
        public allergies: string,
        public emergencyContact1: string,
        public emergencyContact2: string,
        public rfidNumber: string,
        public imageUrl: string,
        public creatorName: string,
        public userId: string,
        public locationFound: PatientLocation
    ) {}
}
