import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { empVM } from 'src/model/employee';

@Injectable({
  providedIn: 'root'
})
export class DataService implements InMemoryDbService {

  constructor() { }

  createDb() {
    let employees : empVM[] = [
      { id:1, department:'Manager', empName: 'mehsin', mobile: '70123456', gender: 'Male', joinDate: '2024-01-01', email: 'mehsin@gmail.com', salary: 4000, password: 'yaAliMadad', empStatus: true},
      { id:2, department:'Accounts', empName: 'ali', mobile: '70654321', gender: 'Male', joinDate: '7/3/2023', email: 'ali187@hotmail.com', salary: 4000, password: 'yaAliMadad', empStatus: true},
      { id:3, department:'Manager', empName: 'fatima', mobile: '70123456', gender: 'Female', joinDate: '7/3/2023', email: 'fatima70@live.com', salary: 4000, password: 'yaAliMadad', empStatus: true}
    ];
    return {employees};
  }
}
