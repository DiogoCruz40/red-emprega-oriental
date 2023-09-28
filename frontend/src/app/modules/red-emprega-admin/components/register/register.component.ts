import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 're-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: any = {
    nome: null,
    email: null,
    password: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  registerForm: FormGroup;
  submitted = false;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {

    this.registerForm = new FormGroup({
      nome: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      password: new FormControl(null, [Validators.required, Validators.pattern('(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@$!#^~%*?&,.<>"\'\\;:\{\\\}\\\[\\\]\\\|\\\+\\\-\\\=\\\_\\\)\\\(\\\)\\\`\\\/\\\\\\]])[A-Za-z0-9\d$@].{7,}')]),
    });
  }

  onSubmit(): void {
    this.submitted = true;
    const { nome, email, password } = this.form;
    if (this.registerForm.invalid) {
      return;
    }
    this.authService.register(nome, email, password)
      .then(
        data => {
          this.isSuccessful = true;
          this.isSignUpFailed = false;
        }
      ).catch(err => {
        this.errorMessage = err.message;
        this.isSignUpFailed = true;
      }).finally(() => this.submitted = true);
  }
}
