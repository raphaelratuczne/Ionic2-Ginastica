import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { SQLite } from '@ionic-native/sqlite';
import { BrowserModule } from '@angular/platform-browser';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AddPage } from '../pages/add/add';
import { ListPage } from '../pages/list/list';
import { OptionsPage } from '../pages/options/options';
import { ConfigPage } from '../pages/config/config';
import { OptionsDataService } from '../providers/options-data.service';
import { GymDataService } from '../providers/gym-data.service';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AddPage,
    ListPage,
    ConfigPage,
    OptionsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      platforms: {
        ios: { backButtonText: 'Voltar' }
      }
    }),
    FormsModule,
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AddPage,
    ListPage,
    ConfigPage,
    OptionsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    OptionsDataService,
    GymDataService,
    SQLite
  ]
})
export class AppModule {}
