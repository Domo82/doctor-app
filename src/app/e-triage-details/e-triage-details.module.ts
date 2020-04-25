import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ETriageDetailsPage } from './e-triage-details.page';

const routes: Routes = [
  {
    path: '',
    component: ETriageDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ETriageDetailsPage]
})
export class ETriageDetailsPageModule {}
