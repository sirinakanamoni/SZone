import { HttpInterceptorFn } from '@angular/common/http';
import { LocalStorage } from 'angular-web-storage';
import { LoaderService } from './loader.service';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
  const loaderService=inject(LoaderService);
  const Token=localStorage.getItem('Token')
  if(Token){
  req=req.clone({
    setHeaders:{Authorization:'Bearer ${Token}'}
  })
}
return next (req).pipe(
  finalize(()=>loaderService.hide())
);

};
