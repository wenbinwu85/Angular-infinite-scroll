import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('lastElement') lastElement!: ElementRef;
  users:{[key: string]: any}[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  lastElementObserver$!: IntersectionObserver;

  constructor(private backend: BackendService) { }

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

    this.lastElementObserver$ = new IntersectionObserver(entries => {
      if (entries[0].intersectionRatio > 0) {
        this.onLoadMore()
      }
    }, options);
  }

  ngAfterViewInit() {
    this.lastElementObserver$.observe(this.lastElement.nativeElement)
  }

  ngOnDestroy() { 
    this.lastElementObserver$.unobserve(this.lastElement.nativeElement);
  }

  onLoadMore() {
    let response = this.backend.getUsers();
    this.users = this.users.concat(response['users']);
    this.currentPage = response['currentPage'];
  }
}
