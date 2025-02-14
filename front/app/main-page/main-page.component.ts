import { Component, ViewChild, HostListener } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpService } from '../http.service';
import { RouterOutlet, RouterLink, Router, RouterModule} from "@angular/router";
import { CommonModule } from '@angular/common'; // Импортируем CommonModule
import { AuthService } from '../auth.service';
import { GraphComponent } from '../graph/graph.component';



class Result {
  constructor(
    public x: string,
    public y: string,
    public r: string,
    public hit: boolean,
    public executionTime: number,
    public currentTime: string
  ) {}
}

class Point {
  constructor(public x: string, 
              public y: string,
              public r: string) { }
}
@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, GraphComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css',
  providers: [HttpService, AuthService]
})
export class MainPageComponent{
  @ViewChild(GraphComponent) graphComponent!: GraphComponent; // Получаем доступ к компоненту
  user: string | null = '';
  serverMessage = "";
  x: string = "";
  y: string = "";
  r: string = "1";
  xValues = [-5, -4, -3, -2, -1, 0, 1, 2, 3];
  rValues = [-5, -4, -3, -2, -1, 0, 1, 2, 3];
  results: Result[] = [];
  points: { x: number, y: number }[] = [];  // Массив для точек, которые отображаются на графике
  point: Point = new Point("","","");
  private heartBeatInterval: any; // Переменная для хранения интервала
  
  constructor(
    private router: Router,
    private httpService: HttpService,
    private authService: AuthService) {}
    private boundMessageHandler: any;
    private unloading = false;  // Флаг для отслеживания закрытия вкладки
    
    ngOnInit() {
      this.user = sessionStorage.getItem('activeUser');
      console.log("active user is " + sessionStorage.getItem('activeUser'));
      if (this.user) {
        this.heartBeatInterval = setInterval(() => this.sendHeartBeat(), 3000);
      }
      this.loadUserPoints();
    }
    ngOnDestroy(): void {
      if (this.heartBeatInterval) {
        clearInterval(this.heartBeatInterval); // Очищаем интервал при уничтожении компонента
      }
    }
  // Метод для валидации Y
  validateY() {
    if (isNaN(parseFloat((this.y).replace(",",".")) )|| parseFloat((this.y).replace(",",".")) < -5 || parseFloat((this.y).replace(",",".")) > 3) {
      this.y = "";  // Если значение некорректное, сбрасываем его
    }
  }
    onPointAdded(point: any) {
      const newPoint = new Result(
        point.x,
        point.y,
        point.r,
        point.hit,
        point.executionTime,
        point.currentTime
      );
  
      this.results.push(newPoint);
    }
  
  
    // Загружаем точки пользователя с сервера
     loadUserPoints() {
    if (this.user) {
      console.log("here")
      this.httpService.getUserPoints(this.user).subscribe(
        (data) => {
          this.results = data.map((point: any) => new Result(
            point.x,
            point.y,
            point.r,
            point.hit,
            point.executionTime,
            point.currentTime
          ));
          console.log(this.results)
          this.points = data.map((point: any) => ({
            x: parseFloat(point.x),
            y: parseFloat(point.y),
            hit: point.hit
          }));
        },
        (error) => console.error('Error loading user points:', error)
      );
    }
  }
  logout() {
    const activeUser = sessionStorage.getItem('activeUser');
    if (activeUser) {
      this.httpService.logout(activeUser).subscribe(() => {
        console.log('User logged out successfully.');
      });
      this.authService.logout();
    }
  }
  isHit(x: number, y: number, r: number): boolean {
  
    if (r === 0) {
      return false;
    }
  
    if (r > 0) {
      if (x > 0 && y > 0) {
        return (x < r / 2 && y < r) ? true : false;
      }
      if (x < 0 && y > 0) {
        return (Math.pow(x, 2) + Math.pow(y, 2) <= Math.pow(r, 2)) ? true : false;
      }
      if (x < 0 && y < 0) {
        return (y >= -r / 2 - x / 2) ? true : false;
      }
    }
  
    if (r < 0) {
      if (x > 0 && y > 0) {
        return (y <= Math.abs(r / 2) - x / 2) ? true : false;
      }
      if (x < 0 && y < 0) {
        return (y > r && x > r / 2) ? true : false;
      }
      if (x > 0 && y < 0) {
        return (Math.pow(x, 2) + Math.pow(y, 2) <= Math.pow(r, 2)) ? true : false;
      }
    }
  
    return false;
  }
  submitForm() {
    const pointData = {
      x: this.x,
      y: this.y.replace(",","."),
      r: this.r,
      owner: this.user
    };

    this.httpService.addPoint(pointData).subscribe(
      (response: any) => {
        // Обработка успешного ответа
        const result = new Result(
          response.x,
          response.y,
          response.r,
          response.hit,
          response.executionTime,
          response.currentTime
        );
        const point = { x: parseFloat(this.x), y: parseFloat(this.y), hit: response.hit };
        this.points.push(point);
        this.results.push(result); 
        this.graphComponent.redrawGraph();
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
  sendHeartBeat() {
    if (this.user) {
      this.httpService.sendHeartBeat(this.user).subscribe(
        (response) => {
        },
        (error) => {
          console.error('Error sending heart-beat:', error);
        }
      );
    }
  }
}
