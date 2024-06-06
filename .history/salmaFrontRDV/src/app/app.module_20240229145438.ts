import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { AccueilComponent } from './accueil/accueil.component';
import { AdminComponent } from './admin/admin.component';
import { ChatComponent } from './chat/chat.component';
import { DelegationsComponent } from './delegations/delegations.component';
import { EtablissementsComponent } from './etablissements/etablissements.component';
import { MedecinComponent } from './medecin/medecin.component';
import { MedecinsComponent } from './medecins/medecins.component';
import { PatientComponent } from './patient/patient.component';
import { SecretaireComponent } from './secretaire/secretaire.component';
import { SignComponent } from './sign/sign.component';
import { UsersComponent } from './users/users.component';
import { MbscModule } from '@mobiscroll/angular';

@NgModule({
  declarations: [
    AppComponent,
    AccueilComponent,
    AdminComponent,
    ChatComponent,
    DelegationsComponent,
    EtablissementsComponent,
    MedecinComponent,
    MedecinsComponent,
    PatientComponent,
    SecretaireComponent,
    SignComponent,
    UsersComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    MbscModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }