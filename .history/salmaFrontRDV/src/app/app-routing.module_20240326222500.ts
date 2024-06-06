import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignComponent } from './sign/sign.component';
import { AccueilComponent } from './accueil/accueil.component';
import { AdminComponent } from './admin/admin.component';
import { PatientComponent } from './patient/patient.component';
import { MedecinComponent } from './medecin/medecin.component';
import { SecretaireComponent } from './secretaire/secretaire.component';
import { UsersComponent } from './users/users.component';
import { EtablissementsComponent } from './etablissements/etablissements.component';
import { DelegationsComponent } from './delegations/delegations.component';
import { MedecinsComponent } from './medecins/medecins.component';
import { ChatComponent } from './chat/chat.component';
import { DescriptionComponent } from './description/description.component';

const routes: Routes = [
  {path:'connecter',component:SignComponent},
  {path:'adminBoard',component:AdminComponent},
  {path:'',component:AccueilComponent},
  {path:'patient',component:PatientComponent},
  {path:'medecin',component:MedecinComponent},
  {path:'secretaire',component:SecretaireComponent},
  {path:'theusers',component:UsersComponent},
  {path:'medecins',component:MedecinsComponent},
  {path:'etablissements',component:EtablissementsComponent},
  {path:'delegations',component:DelegationsComponent},
  {path:'chat',component:ChatComponent},
  {path:'description',component:DescriptionComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
