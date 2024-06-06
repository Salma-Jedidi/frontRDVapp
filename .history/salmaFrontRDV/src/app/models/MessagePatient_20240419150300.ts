export interface MessagePatient {
    idMessage: number;
    nomPatientMessage: string;
    email: string;
    contenueMessage: string;
    reponseMessage: string;
    dateEnvoieMessage?: string;
    dateEnvoiReponse?: string;
    nomRepondMessage?: string; // Add this field if it's relevant
}
