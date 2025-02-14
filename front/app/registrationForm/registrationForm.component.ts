import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpService } from '../http.service';
import { RouterOutlet, RouterLink, Router, RouterModule} from "@angular/router";
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { error } from 'console';


class User {
    constructor(public login: string, 
                public password: string) { }
}

@Component({
  selector: 'registration-form',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './registrationForm.Component.html',
  providers: [HttpService]
})
export class RegistrationForm {
   login: string = '';
     password: string = '';
     greetingsMessage: string = '';
     loginValid: boolean = true;  
     passwordValid: boolean = false;  
     showPasswordField: boolean = false;  
     repeatedPassword: string = '';
     user: User = new User('', '');
     formSubmitted: boolean = false; // Флаг для отслеживания отправки формы

        
     constructor(private router: Router,
      private httpService: HttpService,
      private authService: AuthService) {}

     onLoginChange(): void {
        this.showPasswordField = false; 
        this.password = '';              
        this.repeatedPassword = '';     
        this.passwordValid = false;
      }

     checkLogin() {
       this.httpService.checkUser(this.login).subscribe(userExists => {
         this.showPasswordField = !userExists;
         this.loginValid = !userExists;
       }, error => {
         this.loginValid = false;
         this.showPasswordField = false;
       });
     }
   
     checkPassword() {
       if (!(this.password == this.repeatedPassword) || this.password =='') {
        this.passwordValid = false;
       }
       else {
        this.passwordValid = true;
       }
     }
     addUser(): void {
      this.formSubmitted = true;
      if (this.passwordValid) {
        this.greetingsMessage = "";
        this.httpService.addUser(this.login, this.password).subscribe(
          (response) => {
            if (response.success) {
              this.router.navigate(['/main-page']);
              sessionStorage.setItem('activeUser', this.login);
            } else {
              console.log(response.message);
            }
          },
          (error) => {
            console.log('Error occurred:', error);
          }
        );
      }
      else this.greetingsMessage = "Incorrect Password";
    }
}
   
