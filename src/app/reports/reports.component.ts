import { Component } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { MoneyManagementService } from '../money-management.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ReportsClass } from '../Model/Reports';
import { ExcelService } from '../excel.service';
import { error } from 'node:console';
import { HttpErrorResponse } from '@angular/common/http';
import {PdfService} from '../pdf.service'


@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
  defaultValue = '';
  defaultText = '--Select--';
  reportcls!: ReportsClass;
  ReportsForm!: FormGroup;
  rowData: any = [];
  selectedID: string = "";
  coldefs: any[] = [
    { headerName: 'Transaction Id', field: 'transactionID',flex:1 },
    { headerName: 'Transaction Date', field: 'transactionDate',flex:1 },
    { headerName: 'Expense Type', field: 'expenseType',flex:1 },
    { headerName: 'PayThrough', field: 'payThrough',flex:1 },
    { headerName: 'Account Number', field: 'accountNumber',flex:1 },
    { headerName: 'Amount', field: 'amount',flex:1 },
    { headerName: 'PayMode', field: 'paymode',flex:1 },
    { headerName: 'SpentFor', field: 'spentFor',flex:1 }

  ];

  gridOptions = {
    headerHeight: 24,
    onGridReady: (params: any) => {
      this.gridApi = params.api;
      //   this.loadReports();
    }
  };
  R: any;
  banks: any = [];
  spentlist: any = [];
  gridApi: any;
  Message: string = "";
  TextColor: string = "";

  constructor(private moneymanagementService: MoneyManagementService,
    private toastr: ToastrService,
    private ExcelService: ExcelService,
    private fb: FormBuilder,
    private PdfService:PdfService,
  ) {
    this.formInit()
    this.reportcls = new ReportsClass();
  }
  formInit() {
    this.ReportsForm = this.fb.group({
      ExpensesType: [this.defaultValue],
      PayThrough: [this.defaultValue],
      FromDate: [null],
      ToDate: [null]
    })
  }
  ngOnInit(): void {
    this.moneymanagementService.GetBanks().subscribe((data) => {
      console.log(data);
      this.banks = data;
    }),
      this.moneymanagementService.GetSpentList().subscribe((data) => {
        console.log(data);
        this.spentlist = data;
      })
    this.GetMoneyManagement();
  }
  GetMoneyManagement() {
    this.moneymanagementService.GetAllMoneyManagement().subscribe((response: any) => {
      this.rowData = response;
      console.log(response);
    });
  }
  exporttoexcel() {
    this.ExcelService.exportAsExcelFile(this.rowData, 'sample');
   // console.log(this.rowData);
  }
  exporttopdf(){
    const coldefs = ['transactionID', 'transactionDate','expenseType','payThrough','accountNumber','amount','paymode','spentFor']; 
    const title = 'Reports'; 
    this.PdfService.generatePdf(coldefs, this.rowData, title);
  }

  Get() {
    if (this.ReportsForm.valid) {
      this.reportcls.mode = 'Get'
      this.reportcls.ExpenseList = this.ReportsForm.get('ExpensesType')?.value;
      this.reportcls.BanksList = this.ReportsForm.get('PayThrough')?.value;
      this.reportcls.FromDate = this.ReportsForm.get('FromDate')?.value;
      this.reportcls.ToDate = this.ReportsForm.get('ToDate')?.value;

      console.log('Sending data:', this.reportcls);
      this.moneymanagementService.GetReports(this.reportcls).subscribe((response: any) => {
        if (response && response.length > 0) {
          this.rowData = response;
          this.Message = response.Message;
          console.log(this.rowData);
        }
        else {
          this.Message = response.dbMsg;
          this.TextColor = 'red';
          this.rowData = [];
        }

      },
        (error: HttpErrorResponse) => {
          console.error(error);
          this.Message = error.error?.Message;
          this.TextColor = 'red';
        });
    }
  }
}
