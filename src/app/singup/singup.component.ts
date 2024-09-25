import { Component } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { LoginClass } from '../Model/login';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../login.service';
import { LoginDataRespons } from '../Interface/LoginRespons';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-singup',
  standalone: true,
  imports: [MaterialModule,ReactiveFormsModule,HttpClientModule],
  templateUrl: './singup.component.html',
  styleUrl: './singup.component.css',
  providers:[LoginService]
})
export class SingupComponent {
  Emsg:string="";
  Smsg:string="";
   private lcls!:LoginClass;
       loginForm!: FormGroup ;
  constructor(private fb:FormBuilder, private loginService:LoginService,private router:Router,
   // private ref:MatDialogRef<SingupComponent>
   )
    {
      this.lcls=new LoginClass();
      this.loginForm=this.fb.group({
        UserName: ["", [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
        Password: ["", [Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{6,}$')]], 
        CPassword:["",Validators.required]
        // UserName:["",Validators.required],
        // Password:["",Validators.required]

      })
  }
  signup(){
    // const password = this.loginForm.get('Password')?.value;
    // const confirmPassword = this.loginForm.get('CPassword')?.value;
    // if (password == confirmPassword) {
    //   this.Emsg = 'Password Not Matched';
    //   return;
    // }
    //  else {
    //  this.Emsg = 'password not matched';
    //  return;
    // }
     if (this.loginForm.valid)
      {
          this.lcls = new LoginClass();
           this.lcls.username=this.loginForm.controls["UserName"].value;
           this.lcls.password=this.loginForm.controls["Password"].value;
           this.lcls.cpassword=this.loginForm.controls["CPassword"].value;
           const password = this.loginForm.get('Password')?.value;
           const confirmPassword = this.loginForm.get('CPassword')?.value;
           if (password !== confirmPassword) {
             this.Emsg = 'Password Not Matched';
             return;
           }
           else {this.loginService.Signup(this.lcls).subscribe(
            (response:LoginDataRespons)=>{
             if(response.status==='Success'){
             alert('Signup Successfully')
             this.Smsg="Signup Successfully";
             console.log(this.lcls);
            this.router.navigate(['/login'])
           }
           else
           {
             alert('UserName already Exists')
             this.loginForm.reset();
           }
           },
           (error:HttpErrorResponse)=>{
             console.error('Signup error',error);
           }
         );

            //  this.Emsg = 'password not matched';
              
             }

          
          // this.loginService.Signup(this.lcls).subscribe(
          //    (response:LoginDataRespons)=>{
          //     if(response.status==='Success'){
          //     alert('Signup Successfully')
          //     console.log(this.lcls);
          //    this.router.navigate(['/login'])
          //   }
          //   else
          //   {
          //     alert('UserName already Exists')
          //     this.loginForm.reset();
          //   }
          //   },
          //   (error:HttpErrorResponse)=>{
          //     console.error('Signup error',error);
          //   }
          // );
        }
        else{
          alert('Enter Details');
          this.loginForm.reset();
        }
      }
      Close(){
        //  this.ref.close();
      }
  
}
