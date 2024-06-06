import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'connecter',component:SignComponent},
  {path:'adminBoard',component:AdminComponent},
  {path:'',component:AccueilComponent},
  {path:'patient',component:PatientComponent},
  {path:'medecin',component:MedecinComponent},
  {path:'secretaire',component:SecretaireComponent},
  {path:'users',component:UsersComponent},
  {path:'medecins',component:MedecinsComponent},
  {path:'etablissements',component:EtablissementsComponent},
  {path:'delegations',component:DelegationsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
