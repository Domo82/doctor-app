import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PatientService } from '../patient.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { PatientLocation } from '../patient/location.model';
import { switchMap } from 'rxjs/operators';

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}



@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  form: FormGroup;

  constructor(
    private patientService: PatientService,
    private router: Router,
    private loadingCtrl: LoadingController
    ) { }

  ngOnInit() {
    this.form = new FormGroup({
      forename: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(50)]
      }),
      surname: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(50)]
      }),
      dateOfBirth: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      address: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(250)]
      }),
      pps: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.max(12)]
      }),
      medicalHistory: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(2500)]
      }),
      drugHistory: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(2500)]
      }),
      allergies: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(2500)]
      }),
      emergencyContact1: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.maxLength(10)]
      }),
      emergencyContact2: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.maxLength(10)]
      }),
      emergencyContact3: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.maxLength(10)]
      }),
      imageUrl: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.maxLength(10)]
      }),
      image: new FormControl(null)
    });
  }

  // onLocationPicked(location: PatientLocation) {
  //   this.form.patchValue({location: location});
  // }

  onImagePicked(imageData: string | File) {
    let imageFile;
    if (typeof imageData === 'string') {
      try {
        imageFile = base64toBlob(
          imageData.replace('data:image/png;base64,',''),
          'image/jpeg'
        );
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      imageFile = imageData;
    }
    this.form.patchValue({image: imageFile});
  }

  onCreatePatient() {
    if(!this.form.valid || !this.form.get('image').value) {
      return;
    }
    console.log(this.form.value);
    this.loadingCtrl
    .create({
      message: 'Creating New Patient...'
    })
    .then(loadingEl => {
      loadingEl.present();
      this.patientService
        .uploadImage(this.form.get('image').value).pipe(switchMap(uploadRes => {
          return this.patientService
          .addPatient(
            this.form.value.forename,
            this.form.value.surname,
            new Date(this.form.value.dateOfBirth),
            this.form.value.pps,
            this.form.value.address,
            this.form.value.medicalHistory,
            this.form.value.drugHistory,
            this.form.value.allergies,
            this.form.value.emergencyContact1,
            this.form.value.emergencyContact2,
            this.form.value.emergencyContact3,
            uploadRes.imageUrl
          );
        })
      )
      .subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['/list']);
      });
    });
  }
}
