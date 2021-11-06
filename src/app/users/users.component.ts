import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { debounceTime } from 'rxjs';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, AfterViewInit {
  users:{[key: string]: any}[] = [];
  currentPage: number = 1;
  totalPages: number = 0;

  lastElementObserver!: IntersectionObserver;
  @ViewChild('lastElement') lastElement!: ElementRef;

  constructor(private backend: BackendService, private host: ElementRef) { }

  ngOnInit(): void {
    let response = this.backend.getUsers();
    this.users = response['users'];
    this.currentPage = response['currentPage'];
    this.totalPages = response['totalPages'];

    let options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    }
    this.lastElementObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.intersectionRatio > 0) {
          debounceTime(500)
          this.onLoadMore()
        }
      })
    }, options);
  }

  ngAfterViewInit() {
    this.lastElementObserver.observe(this.lastElement.nativeElement)
  }

  onLoadMore() {
    let response = this.backend.getUsers();
    this.users = this.users.concat(response['users']);
    this.currentPage = response['currentPage'];
  }
}
