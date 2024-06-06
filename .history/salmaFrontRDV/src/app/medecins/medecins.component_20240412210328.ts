
import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';

import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AdminService } from '../services/admin.service';
import { Medecin } from '../models/Medecin';
import { Gouvernorat } from '../models/Gouvernorat';
import { Patient } from '../models/Patient';
import { Etablissement } from '../models/Etablissement';
import { Specialite } from '../models/Specialite';
import { Delegation } from '../models/Delegation';




@Component({
  selector: 'app-medecins',
  templateUrl: './medecins.component.html',
  styleUrls: ['./medecins.component.css']
})
export class MedecinsComponent implements OnInit {
selectedPatient: any;
appliquerAction() {
throw new Error('Method not implemented.');
}
choisirAction(arg0: string,_t33: any) {
throw new Error('Method not implemented.');
}

  medecin: Medecin={
    idMedecin: 0,
    nomMedecin: '',
    cinMedecin: 0,
    tel: '',
    prixConsultation: 0,
    etatMedecin:0,
    libelleSpecialite:'' ,  // Initialisez avec un nouvel objet Specialite
    libelleService:'',
    nomDeletablissement:'',
    delegationMedecin:''
    
  };
  medecins:Medecin[]=[];
  searchMedecinCIN: any;

  specialiteId: any;
  serviceId: any;
  medecinId: any;
  patientId: any;
  rdvId:any;
  etablissementId:any;
 medId:any;
   etablissement:Etablissement={
  idEtablissement:0,
    codeEtablissement: 0,
    libEtablissement:''

};
etablissements:Etablissement[]=[];
selectedetablissement:any;
specialite: Specialite = {
  idSpecialite: 0,
  codeSpecialite: '',
  libSpecialite:''
};

specialites: Specialite[] = [];
selectedSpecialite: any;
rendezVousList: any;
delegation :Delegation={
  idDelegation:1,
  codeDelegation:1,
  libDelegation:'',
  codeDuGouvernorat:1
};
delegations: Delegation[] = [];
  constructor(private adminService: AdminService) {
   
  }
  selectedMedecin: any;


  ngOnInit() {
    this.setupEventListeners();
    this.getAllMedecins();
    this.adminService.getAllEtablissements().subscribe(etablissements => this.etablissements = etablissements);
    this.adminService.getAllSpecialite().subscribe(specialites => this.specialites = specialites);
    this.adminService.getAllDelegations().subscribe(delegations => this.delegations = delegations);
  }

  setupEventListeners() {
  document.querySelector(".jsFilter")?.addEventListener("click", () => {
    document.querySelector(".filter-menu")?.classList.toggle("active");
  });

  document.querySelector(".grid")?.addEventListener("click", () => {
    document.querySelector(".list")?.classList.remove("active");
    document.querySelector(".grid")?.classList.add("active");
    document.querySelector(".products-area-wrapper")?.classList.add("gridView");
    document.querySelector(".products-area-wrapper")?.classList.remove("tableView");
  });

  document.querySelector(".list")?.addEventListener("click", () => {
    document.querySelector(".list")?.classList.add("active");
    document.querySelector(".grid")?.classList.remove("active");
    document.querySelector(".products-area-wrapper")?.classList.remove("gridView");
    document.querySelector(".products-area-wrapper")?.classList.add("tableView");
  });
}
selectMedecin(medecin: Medecin):void {
  this.medecin = medecin;
}
addMedecin() {
    this.adminService.addMedecin(this.medecin).subscribe(
      (addedMedecin: Medecin) => {
        console.log('Medecin added successfully:', addedMedecin);
      },
      (error) => {
        console.error('Error adding Medecin:', error);
      }
    );
  }
  
  updateMedecin() {
    this.adminService.updateMedecin(this.medecin.cinMedecin,this.medecin).subscribe(
      (updatedMedecin: Medecin) => {
        console.log('User updated successfully:', updatedMedecin);
     
      },
      (error) => {
        console.error('Error updating Medecin', error);
  } );
}

  deleteMedecin(MedecinId:number) {
    this.adminService.deleteMedecin(MedecinId).subscribe(
      () => {
        console.log('Medecin deleted successfully');
        
      },
      (error) => {
        console.error('Error deleting Medecin:', error);
        
      }
    );
  }

  affichMedecin(cinMedecin:number) {
    this.adminService.affichMedecin(cinMedecin).subscribe(
      (response:  Medecin) => {
          this.medecins = [response];
        } ,
      (error: any) => {
        this.medecins = [];
        console.error('Error fetching user details:', error);
      }
    );
  }
  getAllMedecins(){
    this.adminService.getAllMedecins().subscribe(
      (medecins: Medecin[]) => {
        this.medecins = medecins;
      },
      (error: any) => {
        console.error('Error fetching Medecins:', error);
      }
    );
  }



 

 
}