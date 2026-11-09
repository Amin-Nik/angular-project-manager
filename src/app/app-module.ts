import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';

@NgModule({
  declarations: [App],
  imports: [BrowserModule, AppRoutingModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: 'AIzaSyBKvz7BOeYFtiugrfa9iC0_mVqQaW2OXeI',
        authDomain: 'angular-project-manager-am.firebaseapp.com',
        databaseURL: 'https://angular-project-manager-am-default-rtdb.firebaseio.com/',
        projectId: 'angular-project-manager-am',
        storageBucket: 'angular-project-manager-am.firebasestorage.app',
        messagingSenderId: '573296648890',
        appId: '1:573296648890:web:304a99faff004b7c7fd883',
      }),
    ),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
  ],
  bootstrap: [App],
})
export class AppModule {}
