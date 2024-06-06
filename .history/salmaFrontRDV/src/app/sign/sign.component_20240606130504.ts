import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/models/User';
import { AuthentificationService } from '../services/authentification.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent implements OnInit {
  showAccueil: boolean = false;
  errorMessage: string | null = null;
  selectedFile: File | null = null;
  public webcamImage: WebcamImage | null = null;
  @Output()
  public pictureTaken = new EventEmitter<WebcamImage>();
  // toggle webcam on/off
 
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string | undefined;
  public videoOptions: MediaTrackConstraints = {
  // width: {ideal: 1024},
  // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];
// webcam snapshot trigger
private trigger: Subject<void> = new Subject<void>();
// switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();
  user: User = {
    id: 0,
    nom: '',
    email: '',
    password: '',
    role: '',
    dateCreation: undefined
  };
  public showWebcam = false;

  // Method to open the camera

  constructor(private authService: AuthentificationService, private router: Router,private http: HttpClient) {}

  ngOnInit() {
    WebcamUtil.getAvailableVideoInputs()
    .then((mediaDevices: MediaDeviceInfo[]) => {
    this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
    });}
    openCamera(): void {
      this.showWebcam = true;
    }
/*   signup(): void {
    this.errorMessage = null;

    this.authService.emailExists(this.user.email).subscribe(emailExists => {
      if (emailExists) {
        this.errorMessage = 'Email already exists';
        alert(this.errorMessage);  // Alert box for email already exists
        return;
      }

      this.authService.isPasswordValid(this.user.password).subscribe(isValid => {
        if (!isValid) {
          this.errorMessage = 'Password must be at least 6 characters long';
          alert(this.errorMessage);  // Alert box for invalid password
          return;
        }

        const newUser: User = {
          id: 0,
          nom: this.user.nom,
          email: this.user.email,
          password: this.user.password,
          role: this.user.role,
          dateCreation: this.user.dateCreation
        };

        this.authService.signup(newUser).subscribe(
          (response) => {
            console.log('Signup successful', response);
            // Handle successful signup response if needed
          },
          (error) => {
            console.error('Signup error:', error);
            this.errorMessage = 'An error occurred during signup';
          }
        );
      });
    });
  } */


/*   login(loginForm: NgForm): void {
    console.log('User object:', this.user);
    if (!this.user.email || !this.user.password) {
      console.error('Email and password are required for login.');
      return;
    }

    const credentials = {
      id: this.user.id,
      nom: this.user.nom,
      email: this.user.email,
      password: this.user.password,
      role: this.user.role,
      dateCreation: this.user.dateCreation

    };

    this.authService.signin(credentials).subscribe(
      (response) => {
        console.log('Login successful:', response);

        // Extract role from the response
        const userRole = response?.role;
        
        console.log('User role:', userRole);

        if (!userRole) {
          this.errorMessage = 'Role information missing';
          return;
        }

        console.log('User role:', userRole);

        switch (userRole.trim().toUpperCase()) {
          case 'PATIENT': 
            console.log('Redirecting to /accueil for PATIENT');
            this.router.navigate(['/patient']);
            break;
          case 'MEDECIN': 
            console.log('Redirecting to /accueil for MEDECIN');
            this.router.navigate(['/medecin']);
            break;
            case 'SECRETAIRE': 
            console.log('Redirecting to /accueil for MEDECIN');
            this.router.navigate(['/secretaire']);
            break;
          case 'ADMIN':
            console.log('Redirecting to /adminBoard for ADMIN');
            this.router.navigate(['/adminBoard']);
            break;
          default:
            console.error('Unknown role:', userRole);
            this.errorMessage = 'Invalid role';
            break;
        }
      },
      (error) => {
        console.error('Login error:', error);
        this.errorMessage = 'Invalid email or password';
      }
    );

    loginForm.resetForm();
  }
 */
  showAccueilComponent(): void {
    this.showAccueil = true;
  }
  onSubmit() {
    this.authService.forgotPassword(this.user.email).subscribe(
      () => {
        console.log('Email de récupération de mot de passe envoyé avec succès.');
      },
      error => {
        console.error('Une erreur s\'est produite lors de l\'envoi de l\'email de récupération de mot de passe :', error);
      }
    );
  }

  

  

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }



 
  

  
  login(loginForm: NgForm): void {
      console.log('User object:', this.user);
  
      // Préparer les deux appels HTTP
      let imageLogin$ = of(null);
      let credentialsLogin$ = of(null);
  
      if (this.webcamImage) {
          const blob = this.dataURItoBlob(this.webcamImage.imageAsDataUrl);
          const formData = new FormData();
          formData.append('file', blob, 'webcamImage.jpg');
          formData.append('email', this.user.email);
  
          imageLogin$ = this.http.post('http://127.0.0.1:5000/login', formData).pipe(
              catchError(error => {
                  console.error('Login error with image', error);
                  this.errorMessage = 'Login failed with image';
                  return of(null); // Retourne un observable nul en cas d'erreur
              })
          );
      }
  
      if (this.user.email && this.user.password) {
          const credentials = {
              email: this.user.email,
              password: this.user.password
          };
  
          credentialsLogin$ = this.authService.signin(credentials).pipe(
              catchError(error => {
                  console.error('Login error with email/password:', error);
                  this.errorMessage = 'Invalid email or password';
                  return of(null); // Retourne un observable nul en cas d'erreur
              })
          );
      }
  
      // Exécuter les deux appels simultanément
      forkJoin([imageLogin$, credentialsLogin$]).subscribe(
          ([imageLoginResponse, credentialsLoginResponse]) => {
              console.log('Image login response:', imageLoginResponse);
              console.log('Credentials login response:', credentialsLoginResponse);
  
              // Gérer les résultats des deux appels
              if (imageLoginResponse) {
                  this.handleLoginSuccess(imageLoginResponse);
              } else if (credentialsLoginResponse) {
                  this.handleLoginSuccess(credentialsLoginResponse);
              } else {
                  this.errorMessage = 'Both login attempts failed';
              }
          },
          error => {
              console.error('Both login attempts failed', error);
              this.errorMessage = 'Both login attempts failed';
          }
      );
  
      loginForm.resetForm();
  }
  
  handleLoginSuccess(response: any): void {
      console.log('Login response:', response);
      let userRole = response?.role;
  
      if (!userRole && response?.message) {
          // Extraire le rôle du message de bienvenue
          const message = response.message;
          if (message.includes('Welcome Dr')) {
              userRole = 'MEDECIN';
          } else if (message.includes('Welcome Mr') || message.includes('Welcome Ms')) {
              // Si vous avez une autre logique pour déterminer si c'est un patient, secrétaire, etc.
              // Ajoutez votre logique ici
              userRole = 'PATIENT';  // Exemple par défaut pour Patient
          }
      }
  
      console.log('User role:', userRole);
  
      if (!userRole) {
          this.errorMessage = 'Role information missing';
          return;
      }
  
      switch (userRole.trim().toUpperCase()) {
          case 'PATIENT':
              console.log('Redirecting to /accueil for PATIENT');
              this.router.navigate(['/patient']);
              break;
          case 'MEDECIN':
              console.log('Redirecting to /accueil for MEDECIN');
              this.router.navigate(['/medecin']);
              break;
          case 'SECRETAIRE':
              console.log('Redirecting to /accueil for SECRETAIRE');
              this.router.navigate(['/secretaire']);
              break;
          case 'ADMIN':
              console.log('Redirecting to /adminBoard for ADMIN');
              this.router.navigate(['/adminBoard']);
              break;
          default:
              console.error('Unknown role:', userRole);
              this.errorMessage = 'Invalid role';
              break;
      }
  }
  
  dataURItoBlob(dataURI: string): Blob {
      const byteString = atob(dataURI.split(',')[1]);
      const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mimeString });
  }
  
  signup(): void {
    this.errorMessage = null;

    // Vérification de l'adresse e-mail existante
    this.authService.emailExists(this.user.email).subscribe(emailExists => {
        if (emailExists) {
            this.errorMessage = 'Email already exists';
            alert(this.errorMessage);  // Alerte pour e-mail déjà existant
            return;
        }

        // Vérification de la validité du mot de passe
        this.authService.isPasswordValid(this.user.password).subscribe(isValid => {
            if (!isValid) {
                this.errorMessage = 'Password must be at least 6 characters long';
                alert(this.errorMessage);  // Alerte pour mot de passe invalide
                return;
            }

            // Création du nouvel utilisateur
            const newUser: User = {
                id: 0,
                nom: this.user.nom,
                email: this.user.email,
                password: this.user.password,
                role: this.user.role,
                dateCreation: this.user.dateCreation
            };

            // Envoi des données à Spring Boot
            this.authService.signup(newUser).subscribe(
                (response) => {
                    console.log('Signup successful with Spring Boot', response);
                    // Envoi des données au serveur Python
                    this.sendDataToPythonServer(newUser);
                },
                (error) => {
                    console.error('Signup error with Spring Boot:', error);
                    this.errorMessage = 'An error occurred during signup with Spring Boot';
                }
            );
        });
    });
}

// Fonction pour envoyer les données au serveur Python
sendDataToPythonServer(newUser: User): void {
    if (this.selectedFile) {
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        formData.append('name', newUser.nom);
        formData.append('email', newUser.email);
        formData.append('password', newUser.password);
        formData.append('role', newUser.role);

        this.http.post('http://127.0.0.1:5000/register', formData).subscribe(
            response => {
                console.log('Signup success with Python server', response);
            },
            error => {
                console.error('Signup error with Python server', error);
                this.errorMessage = 'An error occurred during signup with Python server';
            }
        );
    } else {
        console.error('No file selected for signup');
        this.errorMessage = 'No file selected for signup';
    }
}

  public triggerSnapshot(): void {
    this.trigger.next();
    }
    public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
    }
    public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
    }
    public showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
    }
    public handleImage(webcamImage: WebcamImage): void {
      console.info('received webcam image', webcamImage);
      this.webcamImage = webcamImage;
      this.pictureTaken.emit(webcamImage);
    }
    public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
    }
    public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
    }
    public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
    }
}