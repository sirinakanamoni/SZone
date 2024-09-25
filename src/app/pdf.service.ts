import { Injectable } from '@angular/core';
 import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable';



@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }
  generatePdf(coldefs: string[], rowData: any[], fileName: string) {
    const doc = new jsPDF();

    // Adding a title
    doc.text('Reports', 10, 10);
    const formattedData = rowData.map(item => coldefs.map(col => item[col]));

    // AutoTable settings
    (doc as any).autoTable({
      head:  [coldefs],    
      body:  formattedData,       
      startY: 20          
    });

    // Save the PDF
    doc.save('Reports.pdf');
    }

}
