import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { mapEnvironment } from '../../../environments/environment';
@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('map', {static: false}) mapElementRef: ElementRef;
  clickListener: any;
  googleMaps: any;

  constructor(private modalCtrl: ModalController, private renderer: Renderer2) { }

  ngOnInit() {}

  ngAfterViewInit() {
    this.getGoogleMaps()
    .then(googleMaps => {
      this.googleMaps = googleMaps;
      const mapEl= this.mapElementRef.nativeElement;
      const map = new googleMaps.Map(mapEl, {
        center: {lat:53.3929845, lng:-6.1807422},
        zoom: 16
      });

      this.googleMaps.event.addListenerOnce(map, 'idle', () => {
        this.renderer.addClass(mapEl, 'visible');
      });

      //Tap map to chose location
      this.clickListener = map.addListener('click', event => {
        const selectedCoords = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng()
        };
        this.modalCtrl.dismiss(selectedCoords);
      })
    }).catch(err => {
      console.log(err);
    });
  }

  onCancel(){
    this.modalCtrl.dismiss();
  }

  // when modal is dismissed we destroy the clickListener to avoid memory leaks
  ngOnDestroy() {
    this.googleMaps.event.removeListener(this.clickListener);
  }

  private getGoogleMaps(): Promise<any> {
    const win = window as any;
    const googleModule = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBtQVY_46P1Yr5I04eU6qqsgsuvO_PX2VM';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google maps SDK not available.');
        }
      };
    })
  }

}
