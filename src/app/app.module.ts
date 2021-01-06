import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';

import { AppComponent } from './app.component';
import { PublisherComponent } from './publisher/publisher.component';
import { SubscriberComponent } from './subscriber/subscriber.component';
import { OpentokService } from './opentok.service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    PublisherComponent,
    SubscriberComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [OpentokService],
  bootstrap: [],
  entryComponents: [AppComponent]
})
export class AppModule {

  constructor(injector:Injector) {
    var sessElm=createCustomElement(AppComponent, {injector:injector});
    customElements.define('app-component', sessElm);
  }

  ngDoBootstrap() {

  }
 }
