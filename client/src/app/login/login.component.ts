import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form = new FormGroup({
    username: new FormControl(),
    password: new FormControl()
  }); 
  submitted = false;
  loading = true;

  constructor(private accountService: AccountService, private router: Router) { }

  ngOnInit(): void {
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;

    this.loading = true;

    this.accountService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe({
          next: () => {
              // get return url from query parameters or default to home page
              this.router.navigate(['/contacts']);
          },
          error: error => {
              // this.alertService.error(error);
              console.log('THERE WAS AN ERROR', error);
              this.loading = false;
          }
      });
  }
}
