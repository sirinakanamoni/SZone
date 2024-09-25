import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }
  public exportAsExcelFile(rowData: any[], excelFileName: string):void {
    console.log(rowData);
    const filteredData = rowData.map((row: any) => {
      return {
        transactionID: row.transactionID,
        // clientName: row.clientName,
        transactionDate: row.transactionDate,
        expenseType: row.expenseType,
        payThrough: row.payThrough,
        accountNumber: row.accountNumber,
        amount: row.amount,
        paymode: row.paymode,
        spentFor: row.spentFor
      
      };
    });
    const worksheet: XLSX.WorkSheet=XLSX.utils.json_to_sheet(filteredData);
    const workbook: XLSX.WorkBook={Sheets:{'data1': worksheet }, SheetNames: ['data1']};
    const excelBuffer: any=XLSX.write(workbook,{bookType:'xlsx', type: 'array'});

    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob=new Blob([buffer], {type: EXCEL_TYPE });

    FileSaver.saveAs(data,fileName + 'export' + new Date().getTime() + EXCEL_EXTENSION);
  }

}
