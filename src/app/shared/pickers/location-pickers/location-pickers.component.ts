import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MapModalComponent } from '../../map-modal/map-modal.component';
import { HttpClient } from '@angular/common/http';
import { mapEnvironment} from '../../../../environments/environment';
import { map, switchMap } from 'rxjs/operators';
import { PatientLocation } from '../../../patient/location.model';
import { of } from 'rxjs';

@Component({
  selector: 'app-location-pickers',
  templateUrl: './location-pickers.component.html',
  styleUrls: ['./location-pickers.component.scss'],
})
export class LocationPickersComponent implements OnInit {
  selectedLocationImage: string;
  isLoading = false;

  constructor(private modalCtrl: ModalController, private http: HttpClient) { }

  ngOnInit() {}

  //onClick to open map module
  onPickLocation(){
    this.modalCtrl.create({component: MapModalComponent}).then(modalEl =>{
      modalEl.onDidDismiss().then(modalData => {
        if (!modalData.data) {
          return;
        }
        const patientLocation: PatientLocation = {
          lat: modalData.data.lat,
          lng: modalData.data.lng,
          address: null,
          staticMapImageUrl: null
        }
        this.isLoading = true;
        this.getAddress(modalData.data.lat, modalData.data.lng).subscribe(
          address => {
            console.log(address);
          }
        );
        this.getAddress(modalData.data.lat, modalData.data.lng).pipe(
          switchMap(address => {
            patientLocation.address = address;
            return of(this.getMapImage(patientLocation.lat, patientLocation.lng, 14));
        })
        ).subscribe(staticMapImageUrl => {
          patientLocation.staticMapImageUrl = staticMapImageUrl;
          this.selectedLocationImage = staticMapImageUrl;
          this.isLoading = false;
        });
      });
      modalEl.present();
    });
  }

  // get address of onClick location on the map module
  private getAddress(lat: number, lng: number) {
    return this.http
    .get<any>(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBtQVY_46P1Yr5I04eU6qqsgsuvO_PX2VM`
      ).pipe(
        map(geoData => {
        if(!geoData || !geoData.results || geoData.results.length === 0) {
          return null;
        }
        return geoData.results[0].formatted_address;
      })
    );
  }

  private getMapImage(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
    &markers=color:red%7Clabel:Location%7C${lat},${lng}&key=AIzaSyBtQVY_46P1Yr5I04eU6qqsgsuvO_PX2VM`;
  }

}
