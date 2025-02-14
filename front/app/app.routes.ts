import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';  // Импортируем RouterModule
import { AppComponent } from './app.component';
import { StartPageComponent } from './start-page/start-page.component';
import { MainPageComponent } from './main-page/main-page.component';
import { AuthGuard } from './auth.guard';  // Импортируем AuthGuard
import { NoAuthGuard } from './no-auth.guard';  // Импортируем NoAuthGuard
import { Routes } from '@angular/router';  // Импортируем тип Routes

export const routes: Routes = [
    { path: '', redirectTo: '/start-page', pathMatch: 'full' },
    { path: 'start-page', component: StartPageComponent, canActivate: [NoAuthGuard] },  // Для неавторизованных
    { path: 'main-page', component: MainPageComponent, canActivate: [AuthGuard] },  // Для авторизованных
];

@NgModule({
  imports: [
    StartPageComponent,
    MainPageComponent,
    BrowserModule,
    RouterModule.forRoot(routes),  // Настроить маршруты через RouterModule.forRoot
  ],
  providers: [],
  bootstrap: [],
})
export class AppModule {}