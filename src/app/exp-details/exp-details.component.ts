import { Component } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ExpenseClass } from '../Model/expense';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MoneyManagementService } from '../money-management.service';
import { response } from 'express';

@Component({
  selector: 'app-exp-details',
  standalone: true,
  imports: [MaterialModule,ReactiveFormsModule],
  templateUrl: './exp-details.component.html',
  styleUrl: './exp-details.component.css'
})
export class ExpDetailsComponent {
  expcls:ExpenseClass;
  ExpenseForm!:FormGroup;
  message: string="";
  TextColour: string="";
  rowData: any = [];
  gridOptions = {
    headerHeight: 24,
  };
  coldefs: any[] = [
   
    { headerName: 'ExpenseID', field: 'expID' },
    { headerName: 'ExpenseName', field: 'expName' }
    
  ]
  onRowClicked(event:any):void{
    const selectedData=event.data;
    this.ExpenseForm.patchValue({
      ExpID:selectedData.expID,
      ExpName:selectedData.expName,
    })
  }
  constructor(private fb:FormBuilder,
    private toastr: ToastrService,
    private moneymanagementService: MoneyManagementService,
  ){
      this.expcls=new ExpenseClass();
      this.formInit()
  }
  formInit(){
    this.ExpenseForm=this.fb.group({
      ExpID:['',[Validators.required,this.noSpacesValidator]],
      ExpName:['',Validators.required]
    })
    this.GetAllEpxsdtls()
  }
  GetAllEpxsdtls(){
    this.moneymanagementService.GetAllEpxs().subscribe((response: any) => {
      this.rowData = response;
      console.log(response);
    });
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
  save(){
      if(this.ExpenseForm.invalid){
        this.toastr.error('Please enter Required Fields','Error')
      }
      else{
        try{
          const formValue=this.ExpenseForm.value;
          this.expcls.expid=formValue.ExpID;
          this.expcls.expname=formValue.ExpName;
          this.toastr.success('Details Inserted', 'SUCCESS');
          console.log(this.expcls);
          this.moneymanagementService.saveexp(this.expcls).subscribe((response:any)=>{
            console.log(response);
          },
          (error: HttpErrorResponse) => {
            this.message = "Failed";
            this.TextColour = "red"
          }
        ); 
        }
        catch (ex: any) {
          this.message = ex.message;
          this.TextColour = "red";
        }
        finally {

        }
      }
  }
  Clear(){
    this.ExpenseForm.reset();
  }

}
