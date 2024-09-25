import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoginService } from '../login.service'; // Assuming you use the same service for login
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [MaterialModule,ReactiveFormsModule,HttpClientModule,
    ReactiveFormsModule,FormsModule
  ],
  templateUrl: './forgot-password.component.html',
 // styleUrl: './forgot-password.component.css'
  styleUrls: ['./forgot-password.component.css']
})

export class ForgotPasswordComponent {
public resetPasswordEmail:string='';
public isValidEmail:boolean=true;
// @ViewChild('closebtn') closebtn!: ElementRef;
  constructor() { }

  CheckValidEmail(event:string){
      const value =event;
     // const pattern =/^[\W-\.]+@([\W-]+\.)+[\W-]{2,3}$/;
     const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      this.isValidEmail=pattern.test(value);
      return this.isValidEmail;
  }
  confirmtosend(){
    if(this.CheckValidEmail(this.resetPasswordEmail)){
      console.log(this.resetPasswordEmail);
      this.resetPasswordEmail="";
      const buttonRef=document.getElementById("closebtn");
      buttonRef?.click();
    }
  }

  
  
}
