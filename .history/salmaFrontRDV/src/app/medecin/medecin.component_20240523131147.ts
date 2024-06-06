import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit,Directive, HostListener, ElementRef  } from '@angular/core';
import { fromEvent } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { addDays, addMinutes, endOfWeek } from 'date-fns';
import { AdminService } from '../services/admin.service';
import { Medecin } from '../models/Medecin';
import { EtablissementsComponent } from '../etablissements/etablissements.component';
import { Etablissement } from '../models/Etablissement';
import { Specialite } from '../models/Specialite';
import { Delegation } from '../models/Delegation';
import { RDV } from '../models/RDV';
import { RendezvousService } from '../services/rendezvous.service';
import { Patient } from '../models/Patient';
import { DossierMedical } from '../models/DossierMedical';
import { PatientService } from '../services/patient.service';

interface AppSettings {
  container: HTMLElement;
  calendar: HTMLElement;
  days: NodeListOf<HTMLElement>;
  form: HTMLElement;
  input: HTMLInputElement;
  buttons: NodeListOf<HTMLElement>;
}

@Component({
  selector: 'app-medecin',
  templateUrl: './medecin.component.html',
  styleUrls: ['./medecin.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedecinComponent implements OnInit {

  settings: AppSettings;

  ngOnInit(): void {
    this.init();
    this.adminService.getAllEtablissements().subscribe(etablissements => this.etablissements = etablissements);
    this.adminService.getAllSpecialite().subscribe(specialites => this.specialites = specialites);
    this.adminService.getAllDelegations().subscribe(delegations => this.delegations = delegations);
  
   
  }
  mois: string[] = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  joursSemaine: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  selectedDate: Date = new Date();
  selectedDay: number = this.selectedDate.getDate();

  selectedMonth: string = this.mois[this.selectedDate.getMonth()];
  selectedYear: number = this.selectedDate.getFullYear();

  // Calculer le jour de la semaine en fonction de la date sélectionnée
  selectedDayOfWeek: string = this.joursSemaine[this.selectedDate.getDay()];
 

  nouvelEtat:any;
  cinMedecin: any;
  revenue: any;
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
rdvPasses: RDV[] = [];
rdvAVenir: RDV[] = [];
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
  nouvelleObservation:any;
  patient:Patient={
    idPatient: 0,
    nomPatient: '',
    dateNaissance: undefined,
    cin: 0,
    telephone: 0,
    email: '',
    nomDelegation: '',
    role: 'PATIENT',
    typeCaisse: 'CNRPS',
    modePaiement: 'Especes',
    dateCreation: undefined,
    
  };
  dossierMedical: DossierMedical = {
    idDossier: 1,
    etatClinique: '',
    groupe_sanguin: '',
    allergie: '',
    prescriptions_therapeutiques: '',
    resultats_examen: '',
    observations: '',
    nomDuPatient: '',
    dateNaissancePatient: undefined,
    cinPatient: 1,
    telephonePatient: 1
  };
  constructor(private elementRef: ElementRef,private cdr: ChangeDetectorRef,private adminService: AdminService,private patientService: PatientService,private RendezvousService:RendezvousService) {
    this.settings = {
      container: document.querySelector('.calendar')!,
      calendar: document.querySelector('.front')!,
      days: document.querySelectorAll('.weeks span'),
      form: document.querySelector('.back')!,
      input: document.querySelector('.back input')!,
      buttons: document.querySelectorAll('.back button'),
    };

    this.bindUIActions();
  }

  init(): void {
    this.bindUIActions();
  }

  swap(currentSide: HTMLElement, desiredSide: HTMLElement): void {
    this.settings.container.classList.toggle('flip');
    currentSide.classList.add('hidden');
    desiredSide.classList.remove('hidden');
  }

  bindUIActions(): void {
    this.settings.days.forEach((day) => {
      day.addEventListener('click', () => {
        this.swap(this.settings.calendar, this.settings.form);
        this.settings.input.focus();
      });
    });

    this.settings.buttons.forEach((button) => {
      button.addEventListener('click', () => {
        this.swap(this.settings.form, this.settings.calendar);
      });
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
  onDelegationChange(): void {
    console.log('Selected Delegation:', this.rdv.nomDelegation);
    // You can add more logic if needed
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
 
  handleDayClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const spans = document.querySelectorAll('.weeks span');
    spans.forEach(span => span.classList.remove('active'));
    target.classList.add('active');
    this.toggleBackVisibility();
  }
  daysInMonth(): number[] {
    const daysInMonth = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }
  onMonthChange(month: string) {
    this.selectedMonth = month;
  }

  // Calculate the day of the week based on the selected date
  getSelectedDayOfWeek(): string {
    return this.joursSemaine[this.selectedDate.getDay()];
  }
  isBackVisible: boolean = false;

  // Function to toggle the visibility of the back part
  toggleBackVisibility() {
    this.isBackVisible = !this.isBackVisible;
  }
  isDayActive(day: number): boolean {
    const selectedDay = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), day).getDate();
    return selectedDay === this.selectedDate.getDate();

  }

  afficherRevenue(): void {
    this.adminService.afficherRevenueDuMedecin(this.medecin.cinMedecin).subscribe(
      (revenue: number) => {
        this.revenue = revenue;
        console.log('Revenue du médecin:', this.revenue);
      },
      error => {
        console.error('Une erreur s\'est produite : ', error);
        // Gérez l'erreur ici
      }
    );
  }
  getRDVsForMedecin(): void {
    this.RendezvousService.getRDVsForMedecin(this.medecin.cinMedecin).subscribe(
      (rdvs: RDV[]) => {
        this.rdvs = rdvs;
      },
      error => {
        console.error('Une erreur s\'est produite : ', error);
      }
    );
  } 

  getRevenue(): void {
    this.RendezvousService.getRevenueForMedecin(this.medecin.cinMedecin).subscribe(
      (revenue: number) => {
        this.revenue = revenue;
        console.log('Revenue du médecin:', this.revenue);
      },
      error => {
        console.error('Une erreur s\'est produite : ', error);
        // Gérez l'erreur ici
      }
    );
  }

  marquerEtatRDV() {
    this.RendezvousService.marquerEtatRDV(this.rdv.idRDV, this.nouvelEtat, this.medecin.cinMedecin)
      .subscribe(() => {
        console.log('État RDV mis à jour avec succès');
        // Ajoutez ici toute logique supplémentaire nécessaire après la mise à jour de l'état RDV
      }, error => {
        console.error('Erreur lors de la mise à jour de l\'état RDV :', error);
        // Ajoutez ici toute logique de gestion des erreurs
      });
  }
  getDossierMedical(): void {
    this.patientService.getDossierMedicalByCin(this.patient.cin)
      .subscribe(
        (dossierMedical: DossierMedical) => {
          this.dossierMedical = dossierMedical;
        },
        (error) => {
          console.error('Une erreur est survenue lors de la récupération du dossier médical:', error);
          // Gérer l'erreur selon vos besoins
        }
      );
  }
  ajouterObservation( ): void {
    this.patientService.ajouterObservation(this.dossierMedical.cinPatient,this.nouvelleObservation).subscribe(
      response => {
        console.log(response); // Affiche la réponse dans la console
        // Traitez la réponse comme vous le souhaitez ici
      },
      error => {
        console.error(error); // Affiche l'erreur dans la console
        // Traitez l'erreur comme vous le souhaitez ici
      }
    );
  }
  marquerPaiement(): void {
    this.RendezvousService.marquerPaiement(this.rdv.idRDV, this.rdv.paiementRDV).subscribe(response => {
      console.log(response);
   
    });
  }
  fillFormFields(rdv: RDV): void {
    this.rdv.nomDuPatient = rdv.nomDuPatient;
    this.rdv.nomDuMedecin = rdv.nomDuMedecin;
    this.rdv.dateRDV=rdv.dateRDV;
    this.rdv.heureRdv=rdv.heureRdv;
    this.rdv.idRDV=rdv.idRDV;
  }
  print(): void {
    window.print(); // Appeler la fonction d'impression du navigateur
  }
  associerDossierMedicalAuPatient() {
    this.patientService.associerDossierMedicalAuPatient(this.patient.cin,this.dossierMedical)
      .subscribe(
        (nouveauDossier:DossierMedical) => {
          console.log('Dossier médical associé avec succès au patient:', nouveauDossier);
         
        },
        (error) => {
          console.error('Une erreur est survenue lors de l\'association du dossier médical au patient:', error);
        }
      );
  }
}
