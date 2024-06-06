
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

  assignSpecialiteAndServiceToMedecin() {
    this.adminService.assignSpecialiteAndServiceToMedecin(this.specialiteId, this.serviceId, this.medecinId).subscribe(
      () => {
        console.log("Medecin:", this.medecin.idMedecin);
        console.log('Assigned Specialite and Service to Medecin successfully');
      },
      (error) => {
        console.error('Error assigning Specialite and Service to Medecin:', error);
      }
    );
  }
  assignPatientAndMedecinTordv()  :void{
    this.adminService.assignPatientAndMedecinTordv(this.patientId, this.medId, this.rdvId).subscribe(
      () => {
        console.log('Assigned Patient and Medic to RDV successfully');
      },
      (error) => {
        console.error('Error assigning:', error);
      }
    );
  }
  assignEtablissementToMedecin(): void {
    this.adminService.assignEtablissementToMedecin(this.etablissementId, this.medecinId).subscribe(
      () => {
        console.log('Assignation réussie');
        // Vous pouvez ajouter d'autres actions après la réussite de la requête
      },
      (error) => {
        console.error('Erreur lors de l\'assignation', error);
        // Vous pouvez gérer les erreurs ici
      }
    );
  }


 

 
}