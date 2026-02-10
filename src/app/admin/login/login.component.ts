import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please enter valid credentials';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/878f4f3b-cbb0-40d7-8e65-1ddb684cc19e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login.component.ts:onSubmit',message:'Login submitted',data:{valid:this.loginForm.valid},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/878f4f3b-cbb0-40d7-8e65-1ddb684cc19e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login.component.ts:next',message:'Login successful subscription',data:{},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/878f4f3b-cbb0-40d7-8e65-1ddb684cc19e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login.component.ts:error',message:'Login failed subscription',data:{status:err.status, message:err.message},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        this.errorMessage = err.error?.message || 'Invalid email or password';
        this.isLoading = false;
      }
    });
  }
}
