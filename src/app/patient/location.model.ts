export interface Coordinates {
    lat: number;
    lng: number;
}

export interface PatientLocation extends Coordinates {
    address: string;
    staticMapImageUrl: string;
}