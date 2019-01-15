import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FCM } from '@ionic-native/fcm'
import { HomePage } from '../pages/home/home';
import { AppServices } from "../services/app.services"

@Component({
  templateUrl: 'app.html',
  providers: [FCM]
})
export class MyApp {
  rootPage:any = HomePage;
  public splash:boolean = true;
  public version:number = 1.0

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public serv: AppServices,
    fcm: FCM,
  ) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      if(platform.is('cordova')) {

        fcm.onNotification().subscribe(data=>{
          if(data.wasTapped){
            console.log("Received in background");
          } else {
            console.log(data);
            this.serv.msgServ({
              severity:"success",
              message:data.title + data.body,
              // message:data.topic,
            })
            console.log("Received in foreground");
          };
        })
      } else {
        console.log('Not using cordova')
      }
    });
  }
}
