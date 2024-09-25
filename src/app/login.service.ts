import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { LoginClass } from './Model/login';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { LoginDataRespons } from './Interface/LoginRespons';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import {  Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode'
export interface userResponse{
  userName:string;
  password:string;
  message:string; 
  status:string;
}

@Injectable({
  providedIn: 'root'
})

export class LoginService {
  private jwtToken:string|null=null;
  setUsername(userName:string){
    sessionStorage.setItem('userName',userName);
  }
  setToken(Token:string){
    this.jwtToken=Token;
    sessionStorage.setItem('jwtToken',Token);
  }
  getToken()
  {
    return this.jwtToken || sessionStorage.getItem('jwtToken');
  }
  getUserName(){
    return sessionStorage.getItem('userName');
  }
  // decodeToken(){
  //   const Token =this.getToken();
  //   if(Token){
  //     return jwtDecode(Token);
  //   }
  //   return null;
  // }
  decodeToken() {
    const Token = this.getToken();
    if (Token) {
      try {
        return jwtDecode(Token); // Ensure jwt-decode is imported
      } catch (error) {
        console.error('Error decoding token:', error); // Handle decoding error
        return null;
      }
    }
    return null; // Return null if no token is available
  }
  
  url="https://localhost:44378/"
  loginForm: any;
  dialog: any;
  private loggedIn:BehaviorSubject<boolean>=new BehaviorSubject<boolean>(false);
  get isloggedIn(){
    return this.loggedIn.asObservable();
  }
  constructor(private http:HttpClient,
                private router:Router
  )
   {const currentUser=localStorage.getItem('currentUser');
    if(currentUser){
      this.loggedIn.next(true);
    }
    }
  Login(lcls:LoginClass):Observable<LoginDataRespons>{
    return this.http.post<LoginDataRespons>(this.url+"api/LoginDetails/GetLoginDetails",lcls)
    .pipe(map(response=>{
      if (response && response.status==="Success"){
        console.log(response)
        localStorage.setItem('token',JSON.stringify(response.Token));
        localStorage.setItem('currentUser',JSON.stringify(response));
        this.loggedIn.next(true);
        this.router.navigate(['/home']);
        return response;
      }
      else{
        throw new Error(response.message ||'login failed');
      }
    })
  );
  }
  Signup(lcls:LoginClass):Observable<LoginDataRespons>{
    return this.http.post<LoginDataRespons>(this.url+"api/Signup/SignupForm",lcls)
  }
  GetUsers():Observable<userResponse>{
    return this.http.get<userResponse>(this.url+"api/User/UserDetails")
   }
   forgotPassword(email: string) {
    return this.http.post('/api/auth/forgot-password', { email });
  }
  logout(){
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.router.navigate(['/login'])
  }
  
}
