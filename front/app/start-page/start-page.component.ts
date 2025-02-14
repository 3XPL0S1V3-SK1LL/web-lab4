import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, OnDestroy } from '@angular/core';
import { HttpService } from '../http.service'; 
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Импортируем CommonModule
import { FormsModule } from '@angular/forms';
import { LoginForm } from '../loginForm/loginForm.component';
import { RegistrationForm } from '../registrarionForm/registrationForm.component';

class User {
  constructor(public login: string, public password: string) {}
}

@Component({
  selector: 'start-page',
  imports: [CommonModule, FormsModule, LoginForm, RegistrationForm],
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StartPageComponent  implements OnInit, OnDestroy{
  visible: boolean = true;
  text: string = "Registration Form";
  currentTime: string = '';  // Переменная для хранения времени
  private timeInterval: any;  // Ссылка на setInterval для очистки
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Если пользователь уже авторизован, перенаправляем на main-page
    if (sessionStorage.getItem('activeUser')) {
      this.router.navigate(['/main-page']);
    }

    // Обновляем время каждые 6 секунд
    this.updateTime();
    this.timeInterval = setInterval(() => this.updateTime(), 6000);  // Каждые 6 секунд
  }
  ngOnDestroy(): void {
    // Очистка интервала, когда компонент уничтожается
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }
  updateTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString();  // Обновляем время
  }

  ChangeForm() {
    if (this.visible) {
      this.visible = false;
      this.text = "Login Form"; 
    }
    else {
      this.visible = true;
      this.text = "Registration Form"; 
    }
  }
}
