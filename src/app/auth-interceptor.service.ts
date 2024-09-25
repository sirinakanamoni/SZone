import { HttpInterceptor,HttpRequest,HttpHandler,HttpEvent, } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { request } from 'http';
import { finalize,Observable,observeOn } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService  {

  constructor() { }
  // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   const Token =localStorage.getItem('Authtoken');
  //   if(Token)
  //   {
  //     req = req.clone({
  //       setHeaders:AuthoriZation:`Bearer ${Token}`
  //     })
  //   }
  // }

}
