import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import{MatToolbarModule} from '@angular/material/toolbar';
import{MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonModule} from '@angular/material/button';
import { MatFormFieldModule} from '@angular/material/form-field';
import{MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatRadioModule} from '@angular/material/radio';
import {MatCardModule} from '@angular/material/card';
import { AgGridModule } from 'ag-grid-angular';
import { ToastrModule } from 'ngx-toastr';
import { MatListModule } from '@angular/material/list';

import {MatSnackBarModule} from '@angular/material/snack-bar';
import { HTTP_INTERCEPTORS,HttpClientModule } from '@angular/common/http';
//import { JwtModule } from '@auth0/angular-jwt';

 //import { HttpInterceptorService } from './http-interceptor/http-interceptor.service';

// import { LocalStorageService, SessionStorageService } from 'angular-web-storage';

//  import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient } from '@angular/common/http';
import Module from 'module';
// import { BrowserModule } from '@angular/platform-browser';
export function tokenGetter() {
  return localStorage.getItem('token');
}
const materialObjects=[CommonModule,MatToolbarModule,MatIconModule,
  MatSidenavModule,MatExpansionModule,MatButtonModule,MatFormFieldModule,
  MatSelectModule,MatInputModule,MatDatepickerModule,MatNativeDateModule,
  MatRadioModule,MatCardModule,AgGridModule,MatSnackBarModule,ToastrModule, 
   HttpClientModule,MatListModule

]
@NgModule({
  declarations: [],
  imports: [...materialObjects],
  exports:[...materialObjects],
  providers: [
    // { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true }
  ],
})
export class MaterialModule { }
