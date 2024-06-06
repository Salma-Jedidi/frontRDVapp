import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PatientService } from '../services/patient.service';
import { MessagePatient } from '../models/MessagePatient';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})

export class AccueilComponent implements OnInit {
  messagePatient:MessagePatient={
    idMessage:0,
    nomPatientMessage:'',
    contenueMessage:'',
    reponseMessage:'',
    dateEnvoieMessage:undefined,
    dateEnvoiReponse:undefined,
    email:''
  }
  replyContent: string = ''; // Contenu de la réponse
  replyMessageId: number = 0;
  showCommentSection: boolean[] = [];
  messages: MessagePatient[]=[];
  @ViewChild('commentSection') commentSection!: ElementRef;
  constructor(private patientService: PatientService) { }
  @Input() scheduleType: string = '';
  @Input() iconClass: string = '';
  @Input() title: string = '';
  @Input() content: string = '';
  @Input() timeSlots: string[] = [];


 
  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.patientService.getAllMessages()
      .subscribe(
        (messages: MessagePatient[]) => {
          this.messages = messages;
          this.showCommentSection = new Array(messages.length).fill(false); // Initialiser le tableau avec des valeurs false
        },
        (error: any) => {
          console.error('Error fetching messages:', error);
        }
      );
  }

  toggleCommentSection(index: number): void {
    this.showCommentSection[index] = !this.showCommentSection[index];// Inverser l'état d'affichage correspondant à l'index du message
  }

  replyToMessage(message: MessagePatient): void {
    const replyMessage: MessagePatient = {
      idMessage: message.idMessage, // Utilisez l'ID du message passé en paramètre
      nomPatientMessage: message.nomPatientMessage,
      email: message.email,
      contenueMessage: message.contenueMessage,
      reponseMessage: this.messagePatient.reponseMessage,
      dateEnvoieMessage: message.dateEnvoieMessage, // Utilisez la date d'envoi du message d'origine
      dateEnvoiReponse: undefined, // La date d'envoi de la réponse peut être définie ultérieurement par le backend
      nomRepondMessage: this.messagePatient.nomRepondMessage // Utilisez le nom du répondant du message dans le composant
    };
    
    this.patientService.replyToMessage(replyMessage)
      .subscribe((reponseMessage: MessagePatient) => {
        console.log('Message replied successfully:', reponseMessage);
        this.messagePatient.reponseMessage = ''; // Réinitialisez le contenu de la réponse après l'envoi
      }, error => {
        console.error('Error replying to message:', error);
      });
  }
  

  cancelReply(index: number): void {
    this.messagePatient.reponseMessage = ''; 
    this.messagePatient.nomRepondMessage = ''; 
    this.showCommentSection[index] = false; // Masquer la partie de réponse pour l'élément d'index spécifié
  }
  
  showResponseDetails: boolean = false;
  toggleResponseDetails(event: any): void {
    this.showResponseDetails = event.target.checked;
  }
  sendMessage(): void {
    this.patientService.sendMessage(this.messagePatient)
      .subscribe((sentMessage: MessagePatient) => {
        console.log('Message envoyé avec succès :', sentMessage);
        
      }, error => {
        console.error('Erreur lors de l\'envoi du message :', error);
        
      });
  }
}