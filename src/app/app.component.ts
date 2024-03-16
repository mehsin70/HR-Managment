import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { EmployeeService } from './services/employee.service';
import { empVM } from 'src/model/employee';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { DBOperation } from 'src/Helpers/config';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'HR-Managment';
  employeeForm: FormGroup = new FormGroup({});
  employees: empVM[] = [];
  buttonText: string = "save";
  operation: DBOperation;
  passwordsMatch: boolean = true;

  constructor(private _fb: FormBuilder, private _empService: EmployeeService, private _toastr: ToastrService) {}

  ngOnInit() {
    this.setEmpForm();
    this.allEmployees();
  }

  setEmpForm() {
    this.buttonText = "save";
    this.operation = DBOperation.create;
    this.employeeForm = this._fb.group({
      id: [0],
      department: ['', Validators.required],
      empName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      mobile: ['', Validators.required],
      gender: ['', Validators.required],
      joinDate: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      salary: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      confirmPassword: ['', Validators.required],
      empStatus: [false, Validators.requiredTrue],
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (!password || !confirmPassword) {
      return null;
    }
    return password.value === confirmPassword.value ? null : { mismatch: true };
  }

  formSubmit() {
    if (this.employeeForm.invalid) {
      return;
    }

    if (!this.passwordsMatch) {
      Swal.fire({
        icon: 'error',
        title: 'Passwords do not match',
        text: 'Please make sure the passwords match.',
      });
      return;
    }

    switch (this.operation) {
      case DBOperation.create:
        this._empService.addEmployee(this.employeeForm.value).subscribe(res => {
          this._toastr.success("Employee added successfully", "Employee Registration");
          this.allEmployees();
          this.resetBtn();
        });
        break;

      case DBOperation.update:
        this._empService.updateEmployee(this.employeeForm.value).subscribe(res => {
          this._toastr.success("Employee update successfully", "Employee Registration");
          this.allEmployees();
          this.resetBtn();
        });
        break;
    }
  }

  get f() {
    return this.employeeForm.controls;
  }

  resetBtn() {
    this.employeeForm.reset();
    this.buttonText = "save";
    this.passwordsMatch = true; 
  }

  cancelBtn() {
    this.employeeForm.reset();
    this.buttonText = "save";
    this.passwordsMatch = true; 
  }

  allEmployees() {
    this._empService.getAllEmployees().subscribe((response: empVM[]): void => {
      this.employees = response;
    });
  }

  checkPasswords() {
    const password = this.employeeForm.get('password').value;
    const confirmPassword = this.employeeForm.get('confirmPassword').value;
    this.passwordsMatch = password === confirmPassword;

    if (!this.passwordsMatch) {
      this.employeeForm.get('confirmPassword').setErrors({ mismatch: true });
    } else {
      this.employeeForm.get('confirmPassword').setErrors(null);
    }
  }

  Edit(emp: empVM) {
    this.buttonText = "update";
    this.operation = DBOperation.update;
    this.employeeForm.patchValue({
      id: emp.id,
      department: emp.department,
      empName: emp.empName,
      mobile: emp.mobile,
      gender: emp.gender,
      joinDate: emp.joinDate,
      email: emp.email,
      salary: emp.salary,
      empStatus: emp.empStatus
    });
  
  }

  Delete(empid: number) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this._empService.deleteEmployee(empid).subscribe(res => {
          this.allEmployees();
          this._toastr.success("Employee Deleted", "Employee Registration");
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your imaginary file is safe :)",
          icon: "error"
        });
      }
    });
  }
}
