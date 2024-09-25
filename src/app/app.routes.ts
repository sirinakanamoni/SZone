import { Routes } from '@angular/router';
import { MoneyManagementComponent } from './money-management/money-management.component';
import { MasterDataComponent } from './master-data/master-data.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SingupComponent } from './singup/singup.component';
import { ReportsComponent } from './reports/reports.component';
import { ExpDetailsComponent } from './exp-details/exp-details.component';
import { BanksDlsComponent } from './banks-dls/banks-dls.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

export const routes: Routes = [
    //  {path:'singup',component:SingupComponent},
    //  {path:'',component:LoginComponent}
     
     
    
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    {path:'singup',component:SingupComponent},
    {path:'forgotpassword',component:ForgotPasswordComponent},


    {
        path: 'sidenav',
        component: SidenavComponent, 
        children: [
          {path:'',redirectTo:'home',pathMatch:'full'},
          { path: 'moneymanagement', component: MoneyManagementComponent },
          { path: 'masterdata', component: MasterDataComponent },
          { path: 'home', component: HomeComponent },
          {path:'reports',component:ReportsComponent},
          {path:'expdtls',component:ExpDetailsComponent},
          {path:'banks',component:BanksDlsComponent},
        ]
      }
    //  { path: 'moneymanagement', component: MoneyManagementComponent },
    //  { path: 'masterdata', component: MasterDataComponent }
];
