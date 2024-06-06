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
    this.showCommentSection[index] = !this.showCommentSection[index]; // Inverser l'état d'affichage correspondant à l'index du message
  }

  replyToMessage(message: MessagePatient): void {
    const replyMessage: MessagePatient = {
      idMessage: this.replyMessageId,
      nomPatientMessage: message.nomPatientMessage,
      email: message.email,
      contenueMessage: this.replyContent,
      reponseMessage: '',
      dateEnvoieMessage: '',
      dateEnvoiReponse: '',
      nomRepondMessage: ''
    };
    this.patientService.replyToMessage(replyMessage)
      .subscribe((reponseMessage: MessagePatient) => {
        console.log('Message replied successfully:', reponseMessage);
        this.replyContent = '';
      }, error => {
        console.error('Error replying to message:', error);
      });
  }

  cancelReply(): void {
    this.replyContent = '';
    this.replyMessageId = 0;
  }
  replyToMessage(message: MessagePatient): void {
    // Construire l'objet de réponse avec le contenu et l'ID du message
    const replyMessage: MessagePatient = {
      idMessage: this.replyMessageId,
      nomPatientMessage: message.nomPatientMessage, // ou toute autre information nécessaire
      email: message.email,
      contenueMessage: this.replyContent, // Contenu de la réponse
      reponseMessage: '',
      dateEnvoieMessage: '',
      dateEnvoiReponse: '',
      nomRepondMessage: ''
    };
    // Envoyer la réponse au service
    this.patientService.replyToMessage(replyMessage)
      .subscribe((reponseMessage: MessagePatient) => {
        console.log('Message replied successfully:', reponseMessage);
        // Réinitialiser le contenu de la réponse après l'envoi
        this.replyContent = '';
        // Vous pouvez également recharger la liste des messages si nécessaire
      }, error => {
        console.error('Erreur lors de la réponse au message:', error);
        // Vous pouvez gérer les erreurs ici
      });
  }

  cancelReply(): void {
    // Réinitialiser le contenu de la réponse et l'ID du message auquel répondre
    this.replyContent = '';
    this.replyMessageId = 0;
  }


}