import { Component, Input, Output,EventEmitter,OnInit, inject, NgModule } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule ,Validators} from '@angular/forms';
import { LoginClass } from '../Model/login';
import { LoginService, userResponse } from '../login.service';
import { Router,RouterOutlet,RouterModule } from '@angular/router';
import { HttpClientModule,HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { LoginDataRespons } from '../Interface/LoginRespons';
import { MatDialog } from '@angular/material/dialog';
import { error } from 'console';
import { SingupComponent } from '../singup/singup.component';
import { LocalStorageService, SessionStorageService } from 'angular-web-storage';
import { LoaderComponent } from '../loader/loader.component';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import * as jwt_decode from 'jwt-decode';


// const Error = {
//   username: {
//     pattern: 'Username should not contain any special characters'
//   },
//   password: {
//     pattern: 'Password must contain a minimum of 6 characters includes atleast 1 alphanumeric and special character'
//   }
// }ok na

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MaterialModule,ReactiveFormsModule,HttpClientModule,CommonModule,
    LoaderComponent,RouterOutlet,HttpClientModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers:[LoginService,LocalStorageService,SessionStorageService]
})
export class LoginComponent {
 
  lcls!:LoginClass;
  loginForm!: FormGroup ;
  userlist:any=[]; 
 
  
 
  constructor(private fb:FormBuilder,
              private loginService:LoginService,
              private router: Router,
             // private dialog:MatDialog,
              private localStorage:LocalStorageService,
              private sessionstorage:SessionStorageService
            )
    {
     this.lcls = new LoginClass();
    this.loginForm=this.fb.group({
      UserName:["",Validators.required],
      Password:["",Validators.required]
    })
  }
  
  ngOnInit(){
    // this.sessionstorage.set('username', this.lcls.username);
    // this.sessionstorage.set('password',this.lcls.password); 
    this.loginService.GetUsers().subscribe((data)=>{
      console.log(data);
      this.userlist=data;
    })
  }
  login() {  
    // sessionStorage.setItem('username','siri')
    if(this.loginForm.valid){
      
      this.lcls = new LoginClass();
      this.lcls.username=this.loginForm.controls["UserName"].value;
      this.lcls.password=this.loginForm.controls["Password"].value;
      this.loginService.Login(this.lcls).subscribe(
        (response:LoginDataRespons)=>{
        //  console.log('Raw Response:',response);
        //  if(response.status==="Success"){
          // localStorage.setItem('authToken', response.data.Token);
          //  alert('Login Successfully');
            
           // localStorage.setItem('data',JSON.stringify(this.userlist));
           // sessionStorage.setItem('data',JSON.stringify(this.userlist));
            this.router.navigate(['/sidenav']);
            // if (response.status === "Success" && response.data?.Token) {
            //   localStorage.setItem('authToken', response.data.Token);
            //   alert('Login Successfully');
            //   this.router.navigate(['/sidenav']);
            // } else {
            //   alert(response.message || 'Login failed: No token received');
            //   this.loginForm.reset();
            // }
            
            if(response && response.Token){
              console.log('Received Token:', response.Token);
              this.loginService.setToken(response.Token);
              this.loginService.setUsername(this.lcls.username);
              const decodedToken=this.loginService.decodeToken();
              // console.log('Decoded Token:',decodedToken);
              // console.log('Login Successful',response);
              // if (decodedToken){
              //   console.log('Decoded Token:',decodedToken);
              // }
              // else{
              //   console.log('Login Successful',response);
              // }
              try {
                const decodedToken = (jwt_decode as any)(response.Token);
                console.log('Decoded Token:', decodedToken);
              } catch (error) {
                console.error('Error decoding token:', error);
              }
              
            }
           
            else{
              alert(response.message);
              this.loginForm.reset();
            }
        },
        (error:HttpErrorResponse)=>{
          console.error('Login error',error);
        }
      );
    }
    else {
      alert('Enter UserName&Password');
      this.loginForm.reset();
    }



    //if (this.loginForm.valid) { 
    //   this.errMsg = [];
    //   const usernameControl = this.loginForm.get('UserName');
    //   const passwordControl = this.loginForm.get('Password');
    // if (usernameControl && usernameControl.invalid) {
    //     this.errMsg.push(Error.username.pattern);
    //   }
    //   if (passwordControl && passwordControl.invalid) {
    //     this.errMsg.push(Error.password.pattern); 
    //   }
        //this.lcls.username=this.loginForm.controls["UserName"].value;
        //this.lcls.password=this.loginForm.controls["Password"].value;
      // console.log(this.lcls);
      //this.loginService.Login(this.lcls).subscribe((response)=>{
       // console.log(response);
        //alert('Login sucess');
        //this.router.navigate(['/sidenav']);
     // })
      // if (this.loginForm.get('UserName')!.valid) {
      //   this.errMsg.push(Error.username.pattern);
      // }
      // if (this.loginForm.get('Password')!.valid) {
      //   this.errMsg.push(Error.password.pattern);
      // }
    // } else {
    //   this.lcls=this.loginForm.value;
    //   console.log(this.lcls);
    //   this.errMsg = [];
     
    //   this.loginForm.reset();
    //   alert('Login failed');
    //    this.router.navigate(['/sidenav']);
    // }
  }
  
  
  signup(){
    // this.router.navigateByUrl('/singup')
  // this.dialog.open(SingupComponent,{
      // width:'80%',
      // height:'500px'
   // })
  }
  
  loginWithGoogle(){
    console.log('Login with Google');
  }
  loginWithFacebook(){
    console.log('Login with Facebook');
  }
}
