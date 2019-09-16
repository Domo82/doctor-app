import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule), canLoad: [AuthGuard]},
  { path: 'patient', loadChildren: './patient/patient.module#PatientPageModule', canLoad: [AuthGuard] },
  { path: 'details/:id', loadChildren: './details/details.module#DetailsPageModule', canLoad: [AuthGuard] },
  { path: 'create', loadChildren: './create/create.module#CreatePageModule', canLoad: [AuthGuard] },
  { path: 'search', loadChildren: './search/search.module#SearchPageModule', canLoad: [AuthGuard] },
  { path: 'results', loadChildren: './search/results/results.module#ResultsPageModule', canLoad: [AuthGuard] },
  { path: 'qr-scan', loadChildren: './qr-scan/qr-scan.module#QrScanPageModule', canLoad: [AuthGuard] },
  { path: 'auth', loadChildren: './auth/auth.module#AuthPageModule' },
  { path: 'list', loadChildren: './list/list.module#ListPageModule', canLoad: [AuthGuard] },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
