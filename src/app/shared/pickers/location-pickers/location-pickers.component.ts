import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ModalController, ActionSheetController, AlertController } from '@ionic/angular';
import { MapModalComponent } from '../../map-modal/map-modal.component';
import { HttpClient } from '@angular/common/http';
import { mapEnvironment} from '../../../../environments/environment';
import { map, switchMap } from 'rxjs/operators';
import { PatientLocation, Coordinates } from '../../../patient/location.model';
import { of } from 'rxjs';
import { Plugins, Capacitor, Geolocation } from '@capacitor/core';

@Component({
  selector: 'app-location-pickers',
  templateUrl: './location-pickers.component.html',
  styleUrls: ['./location-pickers.component.scss'],
})
export class LocationPickersComponent implements OnInit {
  @Output() locationPick = new EventEmitter<PatientLocation>();
  selectedLocationImage: string;
  isLoading = false;

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController
    ) { }

  ngOnInit() {}

  //onClick to open map module
  onPickLocation(){
    this.actionSheetCtrl
    .create({
      header: 'Please Choose',
      buttons: [
        {text: 'Auto-Locate', handler: () => {
          this.locateUser();
        }},
        {text: 'Pick on Map', handler: () => {
          this.openMap();
        }
      },
        {text: 'Cancel', role: 'Cancel'}
      ]
    }).then(actionSheetEl => {
      actionSheetEl.present();
    });
  }

  // Use GeoLocation to auto select location on map
  private locateUser() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.showErrorAlert();
      return;
    }
    // use plugin to get current Geo location
    this.isLoading = true;
    Plugins.Geolocation.getCurrentPosition()
    .then(geoPosition => {
      const coordinates: Coordinates = {
        lat: geoPosition.coords.latitude,
        lng: geoPosition.coords.longitude
      };
      this.createPlace(coordinates.lat, coordinates.lng);
      this.isLoading = false;
    })
    .catch(err => {
      this.isLoading = false;
      this.showErrorAlert();
    })
  }

  // if Geolocation is not available, warning alert to manually pick location
  private showErrorAlert() {
    this.alertCtrl
      .create({
        header: 'Could not fetch location',
        message: 'Please use the map to pick a location'
      }).then(alertEl => alertEl.present());
  }

  // open map modal controller to select a location on the map
  private openMap() {
    this.modalCtrl.create({component: MapModalComponent}).then(modalEl =>{
      modalEl.onDidDismiss().then(modalData => {
        if (!modalData.data) {
          return;
        }
        const coordinates: Coordinates = {
          lat: modalData.data.lat,
          lng: modalData.data.lng
        };
        this.createPlace(coordinates.lat, coordinates.lng);
      });
      modalEl.present();
    });
  }

  private createPlace(lat: number, lng: number) {
    const patientLocation: PatientLocation = {
      lat: lat,
      lng: lng,
      address: null,
      staticMapImageUrl: null
    };
     // loading spinner then subscribe address
     this.isLoading = true;
     this.getAddress(lat, lng).subscribe(
       address => {
         console.log(address);
       }
     );
     this.getAddress(lat, lng).pipe(
       switchMap(address => {
         patientLocation.address = address;
         return of(this.getMapImage(patientLocation.lat, patientLocation.lng, 14));
     })
     ).subscribe(staticMapImageUrl => {
       patientLocation.staticMapImageUrl = staticMapImageUrl;
       this.selectedLocationImage = staticMapImageUrl;
       this.isLoading = false;
       this.locationPick.emit(patientLocation);
     });
  }

  // get address of onClick location on the map module with dynamic lat & lng values
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
