import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AutoCompleteModule } from 'ionic4-auto-complete';
import { ReactiveFormsModule } from '@angular/forms';


import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PatientService } from './patient.service';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';





@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    AutoCompleteModule,
    BrowserModule,
    AngularFireModule.initializeApp({
    apiKey: "AIzaSyDncd1aUlmEf3CS6SxZPWuPNmEzBRGcwlw",
    authDomain: "medi-comm-d1778.firebaseapp.com",
    databaseURL: "https://medi-comm-d1778.firebaseio.com",
    projectId: "medi-comm-d1778",
    storageBucket: "medi-comm-d1778.appspot.com",
    messagingSenderId: "939531786941",
    appId: "1:939531786941:web:dbfc599107d6e7cf2135d4"}),
    AngularFirestoreModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule,
    NgxQRCodeModule],

  providers: [
    StatusBar,
    SplashScreen,
    PatientService,
    { provide:RouteReuseStrategy, useClass: IonicRouteStrategy },
    BarcodeScanner,
    Base64ToGallery,
    //OneSignal
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
