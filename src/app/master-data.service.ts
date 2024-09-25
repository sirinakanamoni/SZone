import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {MasterDataClass} from './Model/MasterData';
import{dataresponse} from './Interface/masterdataresponse';
import { catchError,map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { response } from 'express';
import { transition } from '@angular/animations';
import { error } from 'console';


//import { bank } from './money-management.service';
@Injectable({
  providedIn: 'root'
})
export class MasterDataService {
  url="https://localhost:44378/";

  constructor(private http:HttpClient){}
  
  Save(mdcls:MasterDataClass):Observable<dataresponse>{
      return this.http.post<dataresponse>(this.url+"api/MasterDataDetails/MasterData",mdcls)
  }
  GetAllMasterData(){
    return this.http.get(this.url+"api/Master/DataGrid")

  }
  
    // GetData(ID:string,Mode:string):Observable<any>
    // {
    //   return this.http.get<any>(this.url+"api/MasterDataDetails/MasterData?ID="+ID+"&Mode="+Mode)
    // }
    // GetData(ID: string): Observable<any> {
    //   return this.http.get<any>(`${this.url}/View/${ID}`);
    // }

    GetBanks():Observable<bank[]>{
      return this.http.get<bank[]>(this.url+"api/BankDetails/GetBankDetails")
     }
     GetSpentList():Observable<spent[]>{
      return this.http.get<spent[]>(this.url+"api/GetSpentList/SpentListDetails")
     }


     getTransactionsById(id: string):Observable<any>{

     return this.http.get<any>(`${this.url}api/GetTransaction/GetData?ID=${id}`) .pipe(
    //   catchError((error: HttpErrorResponse) => {
    //     if (error.error instanceof ErrorEvent) {
    //       console.error('An error occurred:', error.error.message);
    //   } else {
    //     console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    //   }
    //   return throwError('Something went wrong with the request.');
    // })
    map(response=>{
      return{
        transactions:response
      };
    }),
    catchError(error=>{
      console.error('Error fetching transactions',error);
      return of({transitions:[]});
    })
      );



    }
}
export interface bank{
  id:string;
  name:String;
}
export interface spent{
  id:string;
  name:string;
}