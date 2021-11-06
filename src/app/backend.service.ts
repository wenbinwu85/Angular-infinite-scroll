import { Injectable } from '@angular/core';
import mockData from '../assets/mockData.json';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  users = mockData;
  maxPage = Math.ceil(this.users.length / 10);
  currentPage = 0;
  constructor() { }

  getUsers(): {[key: string]: any} {
    this.currentPage++;

    if (this.currentPage > this.maxPage) {
      return {
        "totalUsers": this.users.length,
        "users": [],
        "totalPages:": this.maxPage,
        "currentPage": this.currentPage
      }
    }

    let start = (this.currentPage-1) * 10;
    let end = start + 10;
    return {
      "totalUsers": this.users.length,
      "users": this.users.slice(start, end),
      "totalPages:": this.maxPage,
      "currentPage": this.currentPage
    }
  }
}
