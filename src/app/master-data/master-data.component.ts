import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MasterDataService } from '../master-data.service';
import { MasterDataClass } from '../Model/MasterData';
import { HttpClientModule } from '@angular/common/http';
import { dataresponse } from '../Interface/masterdataresponse';
//import { GridApi } from 'ag-grid-community';
// import { response } from 'express';
import { AgGridModule } from 'ag-grid-angular';
import { error } from 'node:console';
import { LocalStorageService } from 'angular-web-storage';
import { ToastrService } from 'ngx-toastr';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-master-data',
  standalone: true,
  imports: [MaterialModule, FormsModule, ReactiveFormsModule, HttpClientModule, AgGridModule,
    LoaderComponent],
  templateUrl: './master-data.component.html',
  styleUrls: ['./master-data.component.css'],
  providers: [MasterDataService]
})
export class MasterDataComponent implements OnInit {
  defaultValue = '';
  defaultText = '--Select--';

  banks: any[] = [];
  spentlist: any[] = [];
  filteredList: any[] = [];
  Message: string = "";
  BankExp: string = "BankExp";
  Type = [
    { value: 'Bank', next: 'BanksList' },
    { value: 'Expenses', next: 'ExpenseList' }
  ]
  TextColor: string = "";
  MasterDataForm!: FormGroup;
  mdcls: MasterDataClass;
  rowData: any = [];
  gridOptions = {
    headerHeight: 24,
  };
  coldefs: any[] = [
   
    { headerName: 'Type', field: 'type' },
    { headerName: 'ID', field: 'id' },
    { headerName: 'Name', field: 'name' },
    {
      headerName: 'Actions',
      cellRenderer: (params: any) => this.actionCellRenderer(params),
    },
  ]
  selectedID: any;

  constructor(private fb: FormBuilder,
    private masterDataservice: MasterDataService
    , private localStorage: LocalStorageService,
    private toastr: ToastrService,
  ) {
    this.mdcls = new MasterDataClass();
    this.MasterDataForm = this.fb.group({
      Mode: [this.defaultValue, Validators.required],
      Type: [this.defaultValue],
      BankExp: [this.defaultValue],
      ID: ['', Validators.required],
      Name: ['']
    });
  }

  ngOnInit(): void {

    this.GetAllMasterDataDetails();

    this.masterDataservice.GetBanks().subscribe(data => {
      console.log(data);
      this.banks = data;
      this.filterList();
    });

    this.masterDataservice.GetSpentList().subscribe(data => {
      console.log(data);
      this.spentlist = data;
      this.filterList();
    });
    this.MasterDataForm.get('Mode')!.valueChanges.subscribe(mode =>
      this.OnModeChange(mode)
    );
    this.GetAllMasterDataDetails();
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
    this.MasterDataForm.patchValue({
      Type: selectedData.type,
      ID: selectedData.id,
      Name: selectedData.name,
    });
    this.toastr.info('Record loaded for editing', 'Edit Mode');
  }
  show(){
    this.toastr.info('Check The Information','Warning',{closeButton:true,positionClass:'toast-top-left',timeOut:10000});
  }


  onTypeChange(type: string) {
    const hello = this.Type.find(hi => hi.value === type);
    if (hello) { this.BankExp = hello.next };
    this.filterList(type);
  }

  filterList(type: string = this.MasterDataForm.get('Type')?.value) {
    if (type === 'Bank') {
      this.filteredList = this.banks;
    } else if (type === 'Expenses') {
      this.filteredList = this.spentlist;
    } else {
      this.filteredList = [];
    }
  }
  onBankExpChange(siri: string) {
    const selectedItem = this.filteredList.find(hi => hi.id === siri);
    if (selectedItem) {
      this.MasterDataForm.patchValue({
        ID: selectedItem.id,
        Name: selectedItem.name
      });
    }
  }
  OnModeChange(mode: string) {
    const typeControl = this.MasterDataForm.get('Type');
    const bankExpControl = this.MasterDataForm.get('BankExp');
    const idControl = this.MasterDataForm.get('ID');
    const nameControl = this.MasterDataForm.get('Name');
    if (mode === 'View' || mode === 'Delete') {
      typeControl!.disable();
      bankExpControl!.disable();
      nameControl!.disable();
      idControl!.enable();
    }
    else if (mode === 'Update' || mode === 'Add') {
      typeControl!.enable();
      bankExpControl!.disable();
      idControl!.enable();
      nameControl!.enable();
    }
    else {
      typeControl!.enable();
      bankExpControl!.enable();
      idControl!.enable();
      nameControl!.enable();
    }
  }

  save() {
    if (this.MasterDataForm.valid) {
      // this.toastr.error('please Enter Required Fields','Error');
      // this.toastr.success('Details Inserted','SUCCESS');

      const formData = this.MasterDataForm.value;
      this.mdcls.mode = formData.Mode;
      this.mdcls.type = formData.Type;
      this.mdcls.bankExp = formData.BankExp;
      this.mdcls.id = formData.ID;
      this.mdcls.name = formData.Name;
      const mdcls: MasterDataClass = this.MasterDataForm.value;
      console.log('mdcls:', mdcls);//debugging em antunavu   disconnect 
      if (this.mdcls.mode === 'Add') {

        this.masterDataservice.Save(mdcls).subscribe(
          response => {
            console.log(response);
            this.Message = response.message;
            // this.message='Added Successfully';
            // this.TextColor="green"
            this.toastr.success('Details Inserted', 'SUCCESS');

          },
          error => {
            console.error(error);
            //  this.toastr.error('please Enter Required Fields','Error');

          }
        );
      }
      else if (this.mdcls.mode === 'Update') {
        this.masterDataservice.Save(mdcls).subscribe(response => {
          console.log(response);
          this.Message = response.message;
          this.toastr.success('Details updated', 'SUCCESS');

          // this.Message='Updated successfully';
          // this.TextColor="green";
        },
          error => {
            console.error(error);
            this.toastr.error('please Enter Required Fields', 'Error');

          }
        );
      }
      else if (this.mdcls.mode === 'View') {
        this.masterDataservice.Save(this.mdcls).subscribe(
          (response: dataresponse) => {
            console.log('mdcls:', mdcls);
            console.log(response);
            this.Message = response.message;
            this.toastr.success('Data Retrived', 'SUCCESS');

            // this.TextColor="green"
            this.MasterDataForm.patchValue({
              Type: response.type,
              Name: response.name
            });
            console.log(response);
          },
          error => {
            console.error(error);
            this.toastr.error('please Enter Required Fields', 'Error');

          }
        );
      }
      else if (this.mdcls.mode === 'Delete') {
        this.masterDataservice.Save(mdcls).subscribe(response => {
          console.log(response);
          this.Message = response.message;
          this.TextColor = "green";
          this.toastr.success('Data Deleted', 'SUCCESS');
        },
          error => {
            console.error(error);
            this.toastr.error('please Enter Required Fields', 'Error');

          }
        );
      }
      else {
        console.error('invalid mode', mdcls.mode);
      }
    }
    else {
      console.error('Form is invalid');
      this.toastr.error('please Enter Required Fields', 'Error');
    }
    //kingggg  ooooooo   lolipop
    //-----------------working data ----------------
    // if (this.MasterDataForm.valid) {
    //   const formData = this.MasterDataForm.value;
    //   this.mdcls.mode   = formData.Mode;
    //   this.mdcls.type   = formData.Type;
    //   this.mdcls.BankExp = formData.BankExp;
    //   this.mdcls.ID = formData.ID;
    //   this.mdcls.Name = formData.Name;

    //   if (this.mdcls.mode === 'Add' || this.mdcls.mode === 'Update' || this.mdcls.mode === 'Delete') {
    //     this.masterDataservice.Save(this.mdcls).subscribe(response => {
    //       console.log('Operation successful', response);
    //       this.message = response.Message;
    //       this.TextColor = response.Status === 'SUCCESS' ? 'green' : 'red';
    //     }, error => {
    //       console.error(error);
    //       this.message = error.message;
    //       this.TextColor = 'red';
    //     });
    //   } else if (this.mdcls.mode === 'View' && this.mdcls.ID) {
    //     this.masterDataservice.Save(this.mdcls).subscribe(response => {
    //       console.log('Data Retrieved', response);
    //       if (response.status === 'SUCCESS') {
    //         this.MasterDataForm.patchValue(response);
    //         this.message = response.Message;
    //         this.TextColor = 'green';
    //       } else {
    //         this.message = response.Message;
    //         this.TextColor = 'red';
    //       }
    //     }, error => {
    //       console.error(error);
    //       this.message = error.message;
    //       this.TextColor = 'red';
    //     });
    //   } else {
    //     console.log('Invalid Mode');
    //     this.message = 'Invalid Mode';
    //     this.TextColor = 'red';
    //   }
    // } else {
    //   console.log('Invalid Form');
    //   this.message = 'Invalid Form';
    //   this.TextColor = 'red';
    // }
    //----------------------------------------------

    //  const masterdatacls:MasterDataClass=this.MasterDataForm.value;
    // if(this.MasterDataForm.valid){
    //       const masterdatacls:MasterDataClass=this.MasterDataForm.value;
    //     if(masterdatacls.mode=='Add'){
    //       this.masterDataservice.Save(masterdatacls).subscribe(response=>{
    //         console.log(response);
    //       },
    //       error=>{console.log(error);}
    //     );
    //     }
    //     else if (masterdatacls.mode==='Update'){
    //       this.masterDataservice.Save(masterdatacls).subscribe(response=>
    //       {
    //         console.log(response);
    //       },
    //       error=>{console.error(error);}
    //       );
    //     }
    //     else{
    //       console.error('invalid mode:',masterdatacls.mode);
    //        }
    //   }
    //   else if (this.MasterDataForm.get('ID')?.value!=""&& this.MasterDataForm.get('ID')?.value!=null){
    //     const masterdatacls:MasterDataClass=this.MasterDataForm.value;
    //     console.log('masterdatacls:',masterdatacls);
    //     if(masterdatacls.mode==='View'){
    //       this.masterDataservice.Save(masterdatacls).subscribe(response=>{
    //         console.log(response);
    //       },
    //       error=>{console.error(error);}
    //     );
    //     }
    //     else if (masterdatacls.mode==='Delete'){
    //       this.masterDataservice.Save(masterdatacls).subscribe(response=>{
    //         console.log(response);
    //       },
    //       error=>{console.error(error);}
    //     );
    //     }
    //     else{
    //       console.error("Enter The Code");
    //     }
    //   }
    //   else {
    //     console.error('invalid mode:',masterdatacls.mode);
    //   }
  }
  GetAllMasterDataDetails() {
    this.masterDataservice.GetAllMasterData().subscribe((response: any) => {
      this.rowData = response;
      console.log(response);
    });
  }
  Clear() {
    this.MasterDataForm.reset();
  }

  searchById() {
    const id = this.MasterDataForm.get('ID')?.value;
    if (id) {
      this.masterDataservice.getTransactionsById(id).subscribe(
        (response: any) => {
          console.log('Response from Server', response)
          
           if (response && response.transactions.length === 0)
         // if(this.rowData.length===0)//remove
             {
            this.toastr.info('No transactions found for this ID from VS', 'Info');
          } else {
            this.rowData = response.transactions;

            this.toastr.success('Transactions loaded successfully', 'Success');
          }
        },
        (error: any) => {
          console.error(error);

          this.toastr.error('Failed to load transactions', 'Error');
        }

      );
    } else {
      this.toastr.warning('Please enter an ID', 'Warning');
    }
  }

}
