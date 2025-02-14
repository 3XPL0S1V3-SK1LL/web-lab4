import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpService } from '../http.service';
import { RouterOutlet, RouterLink, Router, RouterModule} from "@angular/router";
import { StartPageComponent } from '../start-page/start-page.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';


class User {
    constructor(public login: string, 
                public password: string) { }
}

@Component({
  selector: 'login-form',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './loginForm.Component.html',
  providers: [HttpService]
})
export class LoginForm {
   login: string = '';
     password: string = '';
     greetingsMessage: string = '';
     loginValid: boolean = true;  
     passwordValid: boolean = true;  
     showPasswordField: boolean = false;  
     repeatedPassword: string = '';
     user: User = new User('', '');
        
     constructor(private router: Router,
       private httpService: HttpService,
       private authService: AuthService) {}
   
     checkLogin() {
       this.httpService.checkUser(this.login).subscribe(userExists => {
         this.showPasswordField = userExists;
         this.loginValid = userExists;
       }, error => {
         this.loginValid = false;
         this.showPasswordField = false;
       });
     }
   
     checkPassword() {
    this.httpService.checkPassword(this.login, this.password).subscribe(response => {
      console.log("status" + response.success);
    if (response.success) {
      this.router.navigate(['/main-page']);
      sessionStorage.setItem('activeUser', this.login);
    } else {
      console.log(response.message)
      this.greetingsMessage = response.message;
    }
  });
}
}
   
