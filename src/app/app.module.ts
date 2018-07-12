import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { MaterialModule } from './shared/material.module';
import { FormsModule } from '@angular/forms';
import { MyFormComponent } from './form/my-form.component';
import { HomeComponent } from './home/home.component';
import { ScheduleComponent } from './home/schedule.component';
import { ChartsComponent } from './home/charts.component';

@NgModule({
  declarations: [
    AppComponent,
    MyFormComponent,
    HomeComponent,
    ScheduleComponent,
    ChartsComponent    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    RouterModule.forRoot([
      { path: 'login', component: MyFormComponent },
      { path: 'home', component: HomeComponent},
      { path: '', redirectTo: 'login', pathMatch: 'full'},
      { path: '**', redirectTo: 'login', pathMatch: 'full'}
  ]),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
