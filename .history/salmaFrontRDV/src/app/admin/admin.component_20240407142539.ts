
import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';

import { User } from '../models/User';
import { AuthentificationService } from '../services/authentification.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AdminService } from '../services/admin.service';
import { RDV } from '../models/RDV';
import { Delegation } from '../models/Delegation';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']

})
export class AdminComponent implements OnInit{
  constructor(private adminService: AdminService) {
   
  }
  delegation :Delegation={
    idDelegation:1,
    codeDelegation:1,
    libDelegation:'',
    codeDuGouvernorat:1
  };
  delegations: Delegation[] = [];
  selectedDelegation: any;

  ngOnInit() {
    this.setupEventListeners();
    this.getAllRDVs();
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
rdv: RDV = {
  idRDV: 0,
  dateRDV: undefined,
  heureRdv: undefined,
  remarques: '',
  etatRDV:'',
  nomDuPatient:'',
  nomDuMedecin:'',
  nomDelegation:'',
  paiementRDV:''
};
rdvs: RDV[] = [];
addRDV() {
  // Add RDV
  this.adminService.addRDV(this.rdv).subscribe(
    (addedRDV: RDV) => {
      console.log('RDV added successfully:', addedRDV);

      // Assign patient and medecin to RDV
      this.adminService.assignPatientAndMedecinTordv(this.rdv.nomDuPatient, this.rdv.nomDuMedecin, addedRDV).subscribe(
        () => {
          console.log('Association successful.');
          // Additional logic if needed
        },
        (error) => {
          console.error('Error associating RDV with Patient:', error);
        }
      );
    },
    (error) => {
      console.error('Error adding RDV:', error);
    }
  );
}

updateRDV() {
  // Assuming you have an RDV object ready to be updated
  this.adminService.updateRDV(this.rdv).subscribe(
    (updatedRDV: RDV) => {
      console.log('RDV updated successfully:', updatedRDV);
    },
    (error) => {
      console.error('Error updating RDV:', error);
    }
  );
}

deleteRDV(idRDV: number) {
  this.adminService.deleteRDV(idRDV).subscribe(
    () => {
      console.log('RDV deleted successfully');
    },
    (error) => {
      console.error('Error deleting RDV:', error);
    }
  );
}

getAllRDVs() {
  this.adminService.getAllRDVs().subscribe(
    (rdvs: RDV[]) => {
      this.rdvs = rdvs;
    },
    (error: any) => {
      console.error('Error fetching RDVs:', error);
    }
  );
}
getEtatRDVClass(etatRDV: number): string {
  switch (etatRDV) {
    case 0:
      return 'status active';
    case 1:
      return 'status cancelled';
    case 2:
      return 'status instant';
    case 3:
      return 'status disabled';
    default:
      return '';
  }
}
getEtatRDVChoice(etatRDV: number): string {
  return 'choix' + etatRDV;
}

getTypeOfEtatRDV(): string {
  return typeof this.rdv.etatRDV;
}





}