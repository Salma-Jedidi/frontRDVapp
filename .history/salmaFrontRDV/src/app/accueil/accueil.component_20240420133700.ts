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
      idMessage: this.replyMessageId,
      nomPatientMessage: message.nomPatientMessage,
      email: message.email,
      contenueMessage: message.contenueMessage,
      reponseMessage: this.messagePatient.reponseMessage, // Utilisez messagePatient.reponseMessage
      dateEnvoieMessage: '',
      dateEnvoiReponse: '',
      nomRepondMessage:  this.messagePatient.nomRepondMessage
    };
    this.patientService.replyToMessage(replyMessage)
      .subscribe((reponseMessage: MessagePatient) => {
        console.log('Message replied successfully:', reponseMessage);
        this.messagePatient.reponseMessage = ''; // Réinitialisez le contenu de la réponse après l'envoi
      }, error => {
        console.error('Error replying to message:', error);
      });
  }
  

  cancelReply(): void {
    this.replyContent = '';
    this.replyMessageId = 0;
  }
}