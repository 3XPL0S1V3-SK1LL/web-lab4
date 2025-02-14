import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Импортируем CommonModule
import { HttpService } from '../http.service';

@Component({
  selector: 'graph',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent {
  @Input() r: number = 1;  // Радиус, выбранный пользователем
  @Output() pointAdded = new EventEmitter<any>(); // Эмитируем событие с точкой
  errorMessage: string = ''; // Сообщение об ошибке, если радиус не выбран
  @Input() points: { x: number, y: number }[] = []; // Массив для хранения точек
  hit: boolean=false;
  user: string | null = '';
  constructor(private httpService: HttpService) {}

  get absR(): number {
    return Math.abs(this.r);  // Получаем абсолютное значение радиуса
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
  getUsernameFromCookie(): string | null {
    return sessionStorage.getItem('activeUser');
  }

  // Обработчик клика на графике
  onClick(event: MouseEvent) {
    this.user = this.getUsernameFromCookie();
    // Проверка на наличие выбранного радиуса
    console.log(this.r);
    if (!this.r) {
      this.errorMessage = "Please select a radius!";
      return;
    }

    this.errorMessage = ''; // Сбросить ошибку, если радиус выбран

    // Получаем координаты клика на графике
    const svg = document.getElementById('graph');
    if (svg && svg instanceof SVGElement) {
      const rect = svg.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;

      // Переводим координаты клика в систему координат графика
      const svgX = ((offsetX - 150) / 100) * Math.abs(this.r);
      const svgY = ((150 - offsetY) / 100) * Math.abs(this.r);

      console.log(`Координаты: x = ${svgX.toFixed(2)}, y = ${svgY.toFixed(2)}`);

      const hit = this.isHit(svgX, svgY, this.r);

      // Добавляем точку в массив
      this.points.push({ x: svgX, y: svgY});

      // Эмитируем событие с точкой (x, y)
      //this.pointAdded.emit({ x: svgX, y: svgY, r: this.r });

      // Отправляем точку на сервер
    const pointData = {
        x: svgX.toFixed(10),
        y: svgY.toFixed(10),
        r: this.r.toString(),
        owner: this.user
      };
      // Отправляем точку на сервер
    this.httpService.addPoint(pointData).subscribe(
    (response: any) => {
      // Сформирован объект ответа от сервера
      const pointWithServerData = {
        x: response.x,
        y: response.y,
        r: response.r,
        hit: response.hit,
        executionTime: response.executionTime,
        currentTime: response.currentTime
      };
  
      // Эмитируем событие с точкой, теперь с данными от сервера
      this.pointAdded.emit(pointWithServerData);
  
      console.log('Point added to database:', response);
    },
    (error) => {
      console.error('Error adding point:', error);
    }
  );
  
    } else {
      console.error("SVG element not found or not valid.");
    }
  }

  // Метод для рисования точки
  drawDot(x: number, y: number, r: number, hit: boolean) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

    // Нормализуем координаты с учетом радиуса
    circle.setAttribute("cx", ((x / Math.abs(r)) * 100).toString());
    circle.setAttribute("cy", (-(y / Math.abs(r)) * 100).toString());

    circle.setAttribute("r", "2");

    if (hit) {
      circle.setAttribute("fill", "green");
    } else {
      circle.setAttribute("fill", "red");
    }

    const svg = document.getElementById('graph');
    svg?.appendChild(circle);
  }

  // Метод для перерисовки графика
  redrawGraph() {
    const svg = document.getElementById('graph');
    if (svg) {
      svg.querySelectorAll("circle").forEach((circle) => circle.remove()); // Убираем старые точки
      this.points.forEach(point => {
        this.drawDot(point.x, point.y, this.r, this.hit);
      });
    }
  }
}
