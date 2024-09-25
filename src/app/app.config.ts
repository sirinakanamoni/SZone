import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
// import { authInterceptor } from './auth.interceptor';
// import { JwtModule } from '@auth0/angular-jwt';
// export function tokenGetter() {
//   return localStorage.getItem('token');
// }


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
     provideClientHydration(), 
     provideAnimationsAsync(),
     provideToastr({closeButton:true,timeOut:10000}),
      provideHttpClient(withInterceptors([authInterceptor]))

    //  provideJwtModule({ config: {
    //   tokenGetter: tokenGetter,
    //   allowedDomains: ['localhost:5001'],
    //   disallowedRoutes: ['http://localhost:5001/api/LoginDetails/GetLoginDetails']
    // }})
     
  
    ]
};


function provideLocalStorage(): import("@angular/core").Provider | import("@angular/core").EnvironmentProviders {
  throw new Error('Function not implemented.');
}

function provideJwtModule(p0: { config: { tokenGetter: any; allowedDomains: string[]; disallowedRoutes: string[]; }; }): import("@angular/core").Provider | import("@angular/core").EnvironmentProviders {
  throw new Error('Function not implemented.');
}

