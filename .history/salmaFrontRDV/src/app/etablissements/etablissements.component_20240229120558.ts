
import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';


import { AuthentificationService } from '../services/authentification.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AdminService } from '../services/admin.service';
import { Etablissement } from '../models/Etablissement';
@Component({
  selector: 'app-etablissements',
  templateUrl: './etablissements.component.html',
  styleUrls: ['./etablissements.component.css']
})
export class EtablissementsComponent {
  constructor(private adminService: AdminService) {
   
  }
  searchEtablissementCode:any;
  etablissement:Etablissement={
  idEtablissement:0,
    codeEtablissement: 0,
    libEtablissement:''

};
etablissements:Etablissement[]=[];
  ngOnInit() {
    this.setupEventListeners();
    this.getAllEtablissements();
    this.affichEtablissement(this.searchEtablissementCode);
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


addEtablissement() {
  this.adminService.addEtablissement(this.etablissement).subscribe(
    (addedEtablissement: Etablissement) => {
      console.log('Etablissement added successfully:', addedEtablissement);
    },
    (error) => {
      console.error('Error adding etablissement:', error);
    }
  );
}

updateEtablissement() {
  this.adminService.updateEtablissement(this.etablissement).subscribe(
    (updatedEtablissement: Etablissement) => {
      console.log('Etablissement updated successfully:', updatedEtablissement);
    },
    (error) => {
      console.error('Error updating etablissement:', error);
    }
  );
}

deleteEtablissement(etablissementId: number) {
  this.adminService.deleteEtablissement(etablissementId).subscribe(
    () => {
      console.log('Etablissement deleted successfully');
    },
    (error) => {
      console.error('Error deleting etablissement:', error);
    }
  );
}

affichEtablissement(codeEtablissement: number) {
  this.adminService.affichEtablissement(codeEtablissement).subscribe(
    (response: Etablissement| Etablissement[]) => {
      if (Array.isArray(response)) {
        this.etablissements = response;
      } else {
        this.etablissements = [response];
      }
      if (this.etablissements.length === 0) {
        console.log('Delegation not found.');
      }
    },
    (error: any) => {
      
      console.error('Error fetching etablissement details:', error);
    }
  );
}

getAllEtablissements() {
  this.adminService.getAllEtablissements().subscribe(
    (etablissements: Etablissement[]) => {
      this.etablissements = etablissements;
    },
    (error: any) => {
      console.error('Error fetching etablissements:', error);
    }
  );
}

}