import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { COMPOSITION_BUFFER_MODE } from '@angular/forms'

import { AppServices } from '../services/app.services';
import { ScreenOrientation } from '@ionic-native/screen-orientation'

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { AssignPageModule } from '../pages/assign/assign.module';
// import { AccessTermPage } from '../pages/access-term/access-term';
// import { UsecasePage } from '../pages/usecase/usecase';
// import { PersonInfoPage } from '../pages/person-info/person-info';
// import { RegisterPage } from '../pages/register/register';
// import { MainPage } from '../pages/main/main';
// import { UserPage } from '../pages/user/user';
// import { WelcomePage } from '../pages/welcome/welcome';
// import { AboutPage } from '../pages/about/about';
// import { FindEmailPage } from '../pages/find-email/find-email';
// import { FindPasswordPage } from '../pages/find-password/find-password';


import { Keyboard } from '@ionic-native/keyboard';
import { AccessTermPageModule } from '../pages/access-term/access-term.module';
import { UsecasePageModule } from '../pages/usecase/usecase.module';
import { PersonInfoPageModule } from '../pages/person-info/person-info.module';
import { RegisterPageModule } from '../pages/register/register.module';
import { MainPageModule } from '../pages/main/main.module';
import { UserPageModule } from '../pages/user/user.module';
import { WelcomePageModule } from '../pages/welcome/welcome.module';
import { AboutPageModule } from '../pages/about/about.module';
import { FindEmailPageModule } from '../pages/find-email/find-email.module';
import { FindPasswordPageModule } from '../pages/find-password/find-password.module';


import { DirectivesModule } from '../directives/directives.module';
import { TapticEngine } from '@ionic-native/taptic-engine';
import { Vibration } from '@ionic-native/vibration';

import { Camera } from '@ionic-native/camera';
import { Diagnostic } from '@ionic-native/diagnostic'

import { NativeStorage } from '@ionic-native/native-storage'

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    // AccessTermPage,
    // UsecasePage,
    // PersonInfoPage,
    // RegisterPage,
    // MainPage,
    // AssignPage,
    // UserPage,
    // WelcomePage,
    // AboutPage,
    // FindEmailPage,
    // FindPasswordPage,
  ],
  imports: [
    BrowserModule,
    DirectivesModule,
    AssignPageModule,
    AccessTermPageModule,
    UsecasePageModule,
    PersonInfoPageModule,
    RegisterPageModule,
    MainPageModule,
    AssignPageModule,
    UserPageModule,
    WelcomePageModule,
    AboutPageModule,
    FindEmailPageModule,
    FindPasswordPageModule,

    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      iconMode: 'ios',
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: COMPOSITION_BUFFER_MODE, // 한글 입력시 반영 타이밍 문제
      useValue: false,
    },
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AppServices,
    NativeStorage,
    ScreenOrientation,
    TextToSpeech,
    TapticEngine,
    Vibration,
    // FCM,
    Camera,
    Diagnostic,
    Keyboard,

  ]
})
export class AppModule {}
