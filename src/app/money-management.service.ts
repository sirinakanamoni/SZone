import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {MoneyManagementClass} from'./Model/MoneyManagement';
import { Observable } from 'rxjs';
import { ExpenseClass } from './Model/expense';
import { BanksClass } from './Model/Banks';
import { ReportsClass } from './Model/Reports';

// export interface GetReports{
//   mode: string;
//   expenseList: string;
//   banksList: string;
//   //fromDate": "2024-09-09T10:34:01.489Z",
//   //"toDate": "2024-09-09T10:34:01.489Z",
//   message: string;
//   status: string;
//   transactionId:number;
//   //"transactionDate": "2024-09-09T10:34:01.489Z",
//   expenseType: string;
//   payThrough: string;
//   accountNumber: string;
//   amount:number;
//   paymode: string;
//   spentFor: string
// }
export interface bank{
  id:string;
  name:String;
  accountNumber:string;
}
export interface spent{
  id:string;
  name:string;
}
export interface reports{

}
interface SaveResponse {
  message: string;
}
@Injectable({
  providedIn: 'root'
})
export class MoneyManagementService {
  url="https://localhost:44378/";

  constructor( private http:HttpClient) {}
    // Save(mmcls:MoneyManagementClass):Observable<any>{
    //     return this.http.post<any>(this.url+"api/MasterDataDetails/MasterData",mmcls)
    // }

      Save(mmcls:MoneyManagementClass){
         return this.http.post(this.url+"api/ManagementData/MoneyManagementDetails",mmcls)
     }
     saveexp(expcls:ExpenseClass){
        return this.http.post(this.url+"api/AddExp/ExpDetails",expcls)
     }
     savebanks(bnkcls:BanksClass){
        return this.http.post(this.url+"api/AddBanks/BankDetails",bnkcls)
     }
     GetBanks():Observable<bank[]>{
      return this.http.get<bank[]>(this.url+"api/BankDetails/GetBankDetails")
     }

     
    //  GetAccount(siri:string):Observable<bank[]>{
    //   return this.http.get<bank[]>(this.url+"api/BankDetails/GetBankDetails")
    //  }

     GetAccount(siri: string): Observable<any> {  
      return this.http.get<any>(`${this.url}api/BankDetails/GetBankDetails?Type=${siri}`);
    }

     GetSpentList():Observable<spent[]>{
      return this.http.get<spent[]>(this.url+"api/GetSpentList/SpentListDetails")
     }
     GetAllMoneyManagement(){
        return this.http.get(this.url+"api/GridMoney/Management")
     } 
     GetAllBanks(){
      return this.http.get(this.url+"api/GridBanks/BanksDetails")
     }
     GetAllEpxs(){
      return this.http.get(this.url+"api/GridExpenses/expDetails")
     }
    //  GetReports(reportscls: any): Observable<any[]> {
    //   return this.http.post<any[]>(`${this.url}api/GetReports/TransactionDetails`, reportscls, {
    //     headers: new HttpHeaders({
    //       'Content-Type': 'application/json'
    //     })
    //   });
    // }
    
     GetReports(reportscls:any):Observable<any[]>{
      return this.http.post<any[]>(this.url+"api/GetReports/TransactionDetails",reportscls)
     }
     DeleteData(TransactionID:number):Observable<any>
     {
      return this.http.delete<any>(`${this.url}api/DeleteTransactions/DeleteDetails?TransactionID=${TransactionID}`);
     }
     
  
    //  GetReports/TransactionDetails
}
