import { Component } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { BanksClass } from '../Model/Banks';
import { ToastrService } from 'ngx-toastr';
import { MoneyManagementService } from '../money-management.service';
import { response } from 'express';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-banks-dls',
  standalone: true,
  imports: [MaterialModule,ReactiveFormsModule],
  templateUrl: './banks-dls.component.html',
  styleUrl: './banks-dls.component.css'
})
export class BanksDlsComponent {
      bnkcls:BanksClass;
      BanksForm!:FormGroup;
  message: string="";
  TextColour: string="";
  rowData: any = [];
  gridOptions = {
    headerHeight: 24,
  };
  coldefs: any[] = [
   
    { headerName: 'BankID', field: 'id' },
    { headerName: 'BankName', field: 'name' },
    { headerName: 'AccountNumber', field: 'accountNumber' },
    
  ]
      constructor(private fb:FormBuilder,
        private toastr: ToastrService,
        private moneymanagementService: MoneyManagementService,
      ){
        this.bnkcls=new BanksClass();
        this.formInit()
      }
      formInit(){
        this.BanksForm=this.fb.group({
          ID:['',[Validators.required,  this.noSpacesValidator]],
          Name:['',Validators.required],
          AcoountNumber:['',Validators.required]
        })
        this.GetAllBanksDetails();
      }
      onRowClicked(event:any):void{
        const selectedData=event.data;
        this.BanksForm.patchValue({
          ID:selectedData.id,
          Name:selectedData.name,
          AcoountNumber:selectedData.accountNumber
        })
      }
      GetAllBanksDetails() {
        this.moneymanagementService.GetAllBanks().subscribe((response: any) => {
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
    
      Save(){
          if(this.BanksForm.invalid){
            this.toastr.error('Please Enter Required Fields','ERROR')
          }
          else{
            try{
              const formValue=this.BanksForm.value;
              this.bnkcls.id=formValue.ID;
              this.bnkcls.name=formValue.Name;
              this.bnkcls.accountnumber=formValue.AcoountNumber;
              this.toastr.success('Details Inserted', 'SUCCESS');
              console.log(this.bnkcls)
              this.moneymanagementService.savebanks(this.bnkcls).subscribe((response)=>{
                  console.log(response)
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
        this.BanksForm.reset()
      }
}
