import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MoneyManagementClass } from '../Model/MoneyManagement';
import { bank, MoneyManagementService, spent } from '../money-management.service';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { response } from 'express';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderComponent } from '../loader/loader.component';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { DatePipe } from '@angular/common';
import { pipe } from 'rxjs';
import { error } from 'node:console';
@Component({
  selector: 'app-money-management',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, FormsModule, HttpClientModule,
    AgGridModule, LoaderComponent, CommonModule, FormsModule,CurrencyPipe],
  templateUrl: './money-management.component.html',
  styleUrl: './money-management.component.css',
  providers: [MoneyManagementService, DecimalPipe,CurrencyPipe,DatePipe]
})
export class MoneyManagementComponent implements OnInit {
 

  selectedDate: any;
  formattedAmount: string | null = null;
  Message:any;
  banks:bank[]=[];
  data: any[] = [];
  word: string = "";
  Amount: number=0;
  defaultValue = '';
  defaultText = '--Select--';
  rowData: any = [];
  coldefs: any[] = [
    { headerName: 'Transaction_Id', field: 'transactionID',flex:1 },
    { headerName: 'Transaction_Date', field: 'transactionDate',flex:1 },
    {headerName:'Expense_Type',field:'expenseType',flex:1},
    { headerName: 'PayThrough', field: 'payThrough',flex:1 },
    {headerName:'Account Number',field:'accountNumber',flex:1},
    { headerName: 'Amount', field: 'amount', flex:1},
    { headerName: 'Pay Mode', field: 'paymode',flex:1 },
    { headerName: 'Spent For', field: 'spentFor',flex:1 },
    {
      headerName: 'Actions',
      cellRenderer: (params: any) => this.actionCellRenderer(params),flex:1
    },
  ];
  originalData: any=[];
  form: any;
 // message: any;
 // message: string;
  onRowClicked(event:any):void{
    const selectedData=event.data;
    console.log(selectedData);
    this.MoneyManagementForm.patchValue({
      // TransactionId:selectedData.transactionId,
      TransactionId: selectedData.transactionID,
      TransactionDate:selectedData.transactionDate,
      ExpenseType:selectedData.expenseType,
      PayThrough:selectedData.payThrough,
     // AcoountNumber:selectedData.accountNumber,
     AccountNumber: selectedData.accountNumber,
      Amount:selectedData.amount,
      Paymode:selectedData.paymode,
      SpentFor:selectedData.spentFor,

    })
  }
  gridOptions = {
    headerHeight: 24
  };

 // Message: string = "";
  TextColour: string = "";
  MoneyManagementForm!: FormGroup;
  moneymanagementcls: MoneyManagementClass;
  //banks: any = [];
  selectedID: string = "";
  spentlist: spent[] = [];
  filteredList: any[] = [];
  hi: boolean = false;
  CurrencyPipe: any;
  // actionCellRenderer: any;
  constructor(private fb: FormBuilder,
    private moneymanagementService: MoneyManagementService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private snackbar: MatSnackBar,
    private decimalPipe: DecimalPipe,
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe
  ) {
    this.moneymanagementcls = new MoneyManagementClass();
    this.formInIt()
    this.actionCellRenderer = this.actionCellRenderer.bind(this);
    // this.formattedAmount = this.CurrencyPipe.transform(this.Amount, '₹', '1.2-2');
    this.formattedAmount = this.decimalPipe.transform(this.Amount, '1.1-3')!;
  }
  onDateChange(date: any) {
    const formattedDate = this.datePipe.transform(date, 'dd/MM/yyyy');
    console.log('Formatted Date: ', formattedDate);
  }

  formInIt() {
    const today = new Date();
    this.MoneyManagementForm = this.fb.group({
      TransactionDate: [today,Validators.required],
      ExpenseType:[this.defaultValue,Validators.required],
      PayThrough: ['',Validators.required],
      AccountNumber:[this.defaultValue,Validators.required],
      Amount: ['',Validators.required],
      Paymode:[this.defaultValue,Validators.required],
      SpentFor: ['',Validators.required],
      TransactionId: ['',Validators.nullValidator]
      //TransactionId: ['']

    })
  }
  noSpacesValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    const hasSpaces = value.indexOf(' ') !== -1; 
    return hasSpaces ? { noSpaces: true } : null;
  }

  preventSpaceInput(event: KeyboardEvent) {
    if (event.key === ' ') {
      event.preventDefault(); 
    }
  }
  ngOnInit(): void {
    this.moneymanagementService.GetBanks().subscribe((data) => {
      console.log(data);
      this.banks = data;
      this.cdr.detectChanges();
    }),
      this.moneymanagementService.GetSpentList().subscribe((data) => {
        console.log(data);
        this.spentlist = data;
        this.cdr.detectChanges();
      })
    this.GetMoneyManagement();

    const typeControl=this.MoneyManagementForm.get('TransactionId');
    typeControl?.disable();


  }
  actionCellRenderer(params: any) {
    const element = document.createElement('button');
    element.innerText = 'Edit';
    element.addEventListener('click', () => this.onEditClick(params));
    return element;
  }
  onEditClick(params: any) {
    const selectedData = params.data;
    this.selectedID = selectedData.id;
    console.log(selectedData);
    this.MoneyManagementForm.patchValue({
      TransactionId: selectedData.transactionID,
      TransactionDate: new Date(selectedData.transactionDate),
      ExpenseType:selectedData.expenseType,
      PayThrough: selectedData.payThrough,
    //  AccountNumber:selectedData.accountNumber,
    AccountNumber: selectedData.accountNumber,
      Amount: selectedData.amount,
      SpentFor: selectedData.spentFor,
    });
    this.toastr.info('Record loaded for editing', 'Edit Mode');
  }
  show() {
    this.toastr.info('Check The Information', 'Warning', { closeButton: true, positionClass: 'toast-top-left', timeOut: 10000 });
    //info,warning,error,success
  }

  // searchTransactions(){
  //   const searchParams = this.MoneyManagementForm.value;
  //   this.moneymanagementService.searchTransactions(searchParams).subscribe(
  //     (response: any[]) => {
  //       this.rowData = response;
  //       this.cdr.detectChanges();
  //     },
  //     (error: HttpErrorResponse) => {
  //       this.toastr.error('Failed to load transactions', 'Error');
  //     }
  //   );
  // }
  search() {
    if (this.word === '') {
      this.rowData = this.originalData;  
    } else {
      this.rowData = this.filterData(this.originalData, this.word);
    }
  }
 
  filterData(data: any[], word: string) {
    const lowercasedWord = word.toLowerCase();  
    return data.filter((d: any) => {
      return d.transactionID?.toString().toLowerCase().includes(lowercasedWord)
         || d.transactionDate?.toString().toLowerCase().includes(lowercasedWord)
         || d.expenseType?.toLowerCase().includes(lowercasedWord)
         || d.payThrough?.toLowerCase().includes(lowercasedWord)
         || d.accountNumber?.toString().toLowerCase().includes(lowercasedWord)
         || d.amount?.toString().toLowerCase().includes(lowercasedWord)
         || d.paymode?.toLowerCase().includes(lowercasedWord)
         || d.spentFor?.toLowerCase().includes(lowercasedWord);
    });
  }



  // search() {
  //   console.log('Before filtering:',this.rowData);
  //   const filteredData=this.filterData(this.rowData, this.word);
  //   console.log('After filtering:',filteredData)
  //   this.rowData=filteredData;  
  //   // const data = this.filterData;
  //   // console.log(data);
  //   // this.rowData = data;
  // }
  // filterData(data: any[], word: string) {
  //   return data.filter((d: any) => {
  //     return d.transactionId?.toString().includes(word)
  //        || d.transactionDate?.toString().includes(word)
  //        || d.expenseType?.toString().includes(word)
  //        || d.payThrough?.toString().includes(word)
  //        || d.accountNumber?.toString().includes(word)
  //        || d.amount?.toString().includes(word)
  //        || d.paymode?.toString().includes(word)
  //        || d.spentFor?.toString().includes(word)
  //   });

  // }
  
  account(bankname: any):void {
    const selectedItem = this.banks.find(item =>item.accountNumber===bankname);
    if (selectedItem) {
      console.log(selectedItem);
      this.MoneyManagementForm.patchValue({
        PayThrough: selectedItem.name 
      });
    }
  }

  Save() {

      
    if (this.MoneyManagementForm.controls["TransactionId"].value) {
      this.moneymanagementcls.TransactionDate = this.MoneyManagementForm.controls["TransactionDate"].value;
      this.moneymanagementcls.ExpenseType = this.MoneyManagementForm.controls["ExpenseType"].value;
      this.moneymanagementcls.PayThrough = this.MoneyManagementForm.controls["PayThrough"].value;
      this.moneymanagementcls.AccountNumber = this.MoneyManagementForm.controls["AccountNumber"].value;
      this.moneymanagementcls.Amount = this.MoneyManagementForm.controls["Amount"].value;
   //   this.moneymanagementcls.Amount = this.MoneyManagementForm.controls["Amount"].value.replace(/[^0-9.]/g, '');
      this.moneymanagementcls.Paymode = this.MoneyManagementForm.controls["Paymode"].value;
      this.moneymanagementcls.SpentFor = this.MoneyManagementForm.controls["SpentFor"].value;
      this.moneymanagementcls.TransactionID = this.MoneyManagementForm.controls["TransactionId"].value;
      this.moneymanagementService.Save(this.moneymanagementcls).subscribe(
        response => {
          console.log(response);
          this.snackbar.open('Updated Successful', 'ok') //(message,action)
          this.refreshData();
        }
      )
    }
    else if (this.MoneyManagementForm.valid) {
     
      // const date = this.MoneyManagementForm.controls['TransactionDate'].value;
      // const formattedDate = this.datePipe.transform(date, 'dd/MM/yyyy');
      // this.moneymanagementcls.TransactionDate = formattedDate;
     
       this.moneymanagementcls.TransactionDate = this.MoneyManagementForm.controls["TransactionDate"].value;
      this.moneymanagementcls.ExpenseType = this.MoneyManagementForm.controls["ExpenseType"].value;
      this.moneymanagementcls.PayThrough = this.MoneyManagementForm.controls["PayThrough"].value;
      this.moneymanagementcls.AccountNumber = this.MoneyManagementForm.controls["AccountNumber"].value;
      this.moneymanagementcls.Amount = this.MoneyManagementForm.controls["Amount"].value;
      this.moneymanagementcls.Paymode = this.MoneyManagementForm.controls["Paymode"].value;
      this.moneymanagementcls.SpentFor = this.MoneyManagementForm.controls["SpentFor"].value;
      //this.moneymanagementcls.transactionId = this.MoneyManagementForm.controls["TransactionId"].value;
      this.toastr.success('Details Inserted', 'SUCCESS');
      console.log(this.moneymanagementcls);
      this.moneymanagementService.Save(this.moneymanagementcls).subscribe(
        response => {

          console.log(response);
          this.snackbar.open('Inserted Successful', 'ok') //(message,action)
          this.refreshData();
    
        }
      )
    }
    else {
      this.toastr.error('please Enter Required Fields', 'Error');
    }
  }
refreshData(){
  this.moneymanagementService.GetAllMoneyManagement().subscribe((response: any) => {
    this.rowData = response;
    this.originalData=response;
    console.log(response);
    this.cdr.detectChanges();
 
 
 }
);
}

  // Save() {
  //     if(this.MoneyManagementForm.controls["TransactionId"].value){
  //       this.moneymanagementcls.TransactionDate = this.MoneyManagementForm.controls["TransactionDate"].value;
  //       this.moneymanagementcls.ExpenseType = this.MoneyManagementForm.controls["ExpenseType"].value;
  //       this.moneymanagementcls.PayThrough=this.MoneyManagementForm.controls["PayThrough"].value;
  //       this.moneymanagementcls.AccountNumber=this.MoneyManagementForm.controls["AccountNumber"].value;
  //       this.moneymanagementcls.Amount = this.MoneyManagementForm.controls["Amount"].value;
  //       this.moneymanagementcls.Paymode=this.MoneyManagementForm.controls["Paymode"].value;
  //       this.moneymanagementcls.SpentFor = this.MoneyManagementForm.controls["SpentFor"].value;
  //       this.moneymanagementcls.TransactionID=this.MoneyManagementForm.controls["TransactionId"].value;
  //       this.moneymanagementService.Save(this.moneymanagementcls).subscribe(response=>{
  //         console.log(response);
  //     //     if(response.=='Inserted Successfully'){
  //     //       this.toastr.success('Details Inserted succ', 'SUCCESS')
  //     //       this.snackbar.open('Inserted Successfully', 'OK')
  //     //     }
  //     //     else{
  //     //       const errormessage = response.message ||
  //     //       this.toastr.error(`Error: ${errormessage}`, 'Insert Failed');
  //     //       this.snackbar.open('Failed to Insert', 'OK');
  //     //     }
  //       })
  //     }
  //     else if (this.MoneyManagementForm.value){
  //       this.moneymanagementcls.TransactionDate = this.MoneyManagementForm.controls["TransactionDate"].value;
  //       this.moneymanagementcls.ExpenseType = this.MoneyManagementForm.controls["ExpenseType"].value;
  //       this.moneymanagementcls.PayThrough=this.MoneyManagementForm.controls["PayThrough"].value;
  //       this.moneymanagementcls.AccountNumber=this.MoneyManagementForm.controls["AccountNumber"].value;
  //       this.moneymanagementcls.Amount = this.MoneyManagementForm.controls["Amount"].value;
  //       this.moneymanagementcls.Paymode=this.MoneyManagementForm.controls["Paymode"].value;
  //       this.moneymanagementcls.SpentFor = this.MoneyManagementForm.controls["SpentFor"].value;
  //     //  this.moneymanagementcls.TransactionID=this.MoneyManagementForm.controls["TransactionId"].value;
  //       this.toastr.success('Details Inserted','SUCCESS');
  //       console.log(this.moneymanagementcls);
  //       this.moneymanagementService.Save(this.moneymanagementcls).subscribe(response=>{
  //         console.log(response);
  //         // if(response.Message=='Inserted Successfully'){
  //         //   this.toastr.success('Details Inserted successfully', 'SUCCESS')
  //         //   this.snackbar.open('Inserted Successfully', 'OK')
  //         // }
  //         // else{
  //         //   this.toastr.success('Details Updated Successfully', 'SUCCESS')
  //         //   this.snackbar.open('Inserted Successfully', 'OK')
  //         // }
  //       })
  //     }




  
    // if (this.MoneyManagementForm.invalid) {  
    //   this.toastr.error('please Enter Required Fields', 'Error');
    //   this.snackbar.open('Failed to Insert', 'OK')
    //   return;
    // }
    // else {
    //   try {
    //     const frmValue = this.MoneyManagementForm.value;
    //    // this.moneymanagementcls.Mode='Insert'
    //     this.moneymanagementcls.TransactionDate = frmValue.TransactionDate;
    //     this.moneymanagementcls.ExpenseType = frmValue.ExpenseType;
    //     this.moneymanagementcls.PayThrough=frmValue.PayThrough;
    //     this.moneymanagementcls.AccountNumber=frmValue.AccountNumber;
    //     this.moneymanagementcls.Amount = frmValue.Amount;
    //     this.moneymanagementcls.Paymode=frmValue.Paymode;
    //     this.moneymanagementcls.SpentFor = frmValue.SpentFor;
    //   // this.moneymanagementcls.TransactionID = frmValue.TransactionId;

    //     console.log(this.moneymanagementcls);
    //     this.moneymanagementService.Save(this.moneymanagementcls).subscribe((response: any) => {
    //       console.log(response);
    //       this.toastr.success('Details Inserted succ', 'SUCCESS');
    //       this.snackbar.open('Inserted Successfully', 'OK');
         
    //       this.GetMoneyManagement()

        

    //     },
    //       (error: HttpErrorResponse) => {
    //         this.Message = "Failed";
    //         this.TextColour = "red"
    //         console.error('Error Status:', error.status);
    //         console.error('Error Details:', error.error);
    //         this.toastr.error(`Error: ${error.message}`, 'Insert Failed');
    //         this.snackbar.open('Failed to Insert', 'OK');
    //       }
    //     );
    //   }
    //   catch (ex: any) {
    //     this.Message = ex.message;
    //     this.TextColour = "red";
    //   }
    //   finally {

    //   }

    // }
 // }
  // update(){
  //   if (this.MoneyManagementForm.invalid) {  
  //     this.toastr.error('please Enter Required Fields', 'Error');
  //     this.snackbar.open('Failed to Insert', 'OK')
  //     return;
  //   }
  //   else {
  //     try {
  //       const frmValue = this.MoneyManagementForm.value;
  //       this.moneymanagementcls.Mode='Update'
  //       this.moneymanagementcls.TransactionDate = frmValue.TransactionDate;
  //       this.moneymanagementcls.ExpenseType = frmValue.ExpenseType;
  //       this.moneymanagementcls.PayThrough=frmValue.PayThrough;
  //       this.moneymanagementcls.AccountNumber=frmValue.AccountNumber;
  //       this.moneymanagementcls.Amount = frmValue.Amount;
  //       this.moneymanagementcls.Paymode=frmValue.Paymode;
  //       this.moneymanagementcls.SpentFor = frmValue.SpentFor;
  //      this.moneymanagementcls.TransactionID = frmValue.TransactionId;
  //       console.log(this.moneymanagementcls);
  //       this.moneymanagementService.Save(this.moneymanagementcls).subscribe((response: any) => {
  //        console.log(response);
  //        this.toastr.success('Details Updated Successfully', 'SUCCESS');
  //        this.snackbar.open('Updated Successfully', 'OK');
  //         if(response.Status==='SUCCESS'){
  //           this.message=response.Message;
  //         }
  //         else 
  //         {
  //           this.message=response.Message;
  //         }
  //       });  
  //     }
  //     catch(ex:any){
  //       this.message=ex.Message;
  //     }
  //   }
  // }
  Clear() {
    this.MoneyManagementForm.reset();
    // this.hi = false;
  }
  // GetMoneyManagement(){
  //   this.moneymanagementService.GetAllMoneyManagement().subscribe((response:any)=>{
  //     console.log(response);
  //     this.rowData=response;
  //   })
  // }
  GetMoneyManagement() {
    this.moneymanagementService.GetAllMoneyManagement().subscribe((response: any) => {
       this.rowData = response;
       this.originalData=response;
       console.log(response);
       this.cdr.detectChanges();
    
    
    }
  );
  }
  // Grid(){
  //   // this.GetMoneyManagement();
  // }

  delete(){
    const TransactionID=this.MoneyManagementForm.controls["TransactionId"].value;
    if(TransactionID){
      this.moneymanagementService.DeleteData(TransactionID).subscribe(response=>{
        console.log("Record Deleted Successfully",response);
      //  this.snackbar.open('Data Deleted  Successful', 'ok') 
      this.toastr.success('Details Deleted Successfully', 'SUCCESS');
this.MoneyManagementForm.reset();
        this.refreshData();
      },
      error=>{
        console.error("Error deleting record", error);
      }
    )
    }
    else{
      console.error("TransactionId is missing");
    }
  }
}
