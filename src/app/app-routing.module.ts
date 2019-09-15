import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'patient', loadChildren: './patient/patient.module#PatientPageModule' },
  { path: 'details/:id', loadChildren: './details/details.module#DetailsPageModule' },
  { path: 'create', loadChildren: './create/create.module#CreatePageModule' },
  { path: 'search', loadChildren: './search/search.module#SearchPageModule' },
  { path: 'results', loadChildren: './search/results/results.module#ResultsPageModule' },
  { path: 'qr-scan', loadChildren: './qr-scan/qr-scan.module#QrScanPageModule' },
  { path: 'auth', loadChildren: './auth/auth.module#AuthPageModule' },
  { path: 'list', loadChildren: './list/list.module#ListPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
