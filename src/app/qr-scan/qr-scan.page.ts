import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-qr-scan',
  templateUrl: './qr-scan.page.html',
  styleUrls: ['./qr-scan.page.scss'],
})
export class QrScanPage implements OnInit {
  [x: string]: any;
  qrData = 'https://ionicacademy.com/';
  scannedCode = null;
  elementType: 'url' | 'canvas' | 'img' = 'canvas';

  constructor(
    private barcodescanner: BarcodeScanner,
    private base64: Base64ToGallery,
    private toatCtrl: ToastController
    ) {}

    ngOnInit(){
      
    }

    scanCode() {
      this.barcodescanner.scan().then(
        barcodeData => {
          this.scannedCode = barcodeData.text;
        },
        err => console.log('Scan Error: ', err)
      );
    }

    downloadQR() {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      const imageData = canvas.toDataURL('image/jpeg').toString();

      var data = imageData.split(',')[1];

      this.base64ToGallery.base64ToGallery(data, { prefix: '_img', mediaScanner: true })
      .then(
        async res => {
          let toast = await this.toatCtrl.create({
            header: 'QR Code saved in your photo library'
          });
          toast.present();
        },
        err => console.log('Error saving image to gallery', err)
      );
    }
}
