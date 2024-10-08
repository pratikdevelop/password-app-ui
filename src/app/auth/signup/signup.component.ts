import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PlanService } from '../../services/plan.service';
import { SecurityQuestionService } from '../../services/security-question.service';
import zxcvbn from 'zxcvbn';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import {
  NgxPayPalModule,
  IPayPalConfig,
  ICreateOrderRequest,
} from 'ngx-paypal';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatSnackBarModule,
    RouterModule,
    MatButtonModule,
    CommonModule,
    MatStepperModule,
    MatOptionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatProgressBarModule,
    NgxPayPalModule,
    HttpClientModule,
    MatSliderModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './signup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  isPaidPlan: boolean = false;
  readonly snackbar = inject(MatSnackBar);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly authService = inject(AuthService);
  readonly planService = inject(PlanService);
  readonly securityQuestionService = inject(SecurityQuestionService);
  readonly http = inject(HttpClient);
  readonly formBuilder = inject(FormBuilder);

  plan = [
    {
      id: 'null',
      title: 'Free Plan',
      amount: 0,
      currency: 'USD',
      interval: 'month',
      intervalCount: 1,
      features: [
        {
          icon: '💾',
          text: '500 MB Storage',
          _id: '66edb1f317812bd55ad87b4b',
        },
        {
          icon: '📦',
          text: 'Store passwords, notes, cards, ID proofs',
          _id: '66edb1f317812bd55ad87b4c',
        },
        {
          icon: '👥',
          text: '1 Organization',
          _id: '66edb1f317812bd55ad87b4d',
        },
        {
          icon: '📧',
          text: '5 User Invitations',
          _id: '66edb1f317812bd55ad87b4e',
        },
        {
          icon: '🔑',
          text: '5 Shares',
          _id: '66edb1f317812bd55ad87b4f',
        },
      ],
      buttonLink: '/auth/signup',
      buttonText: 'Get Started',
      hasTrial: false,
      queryParams: {
        plan: 'free',
        action: 'signup',
      },
    },
    {
      id: 'P-6XR17625JV867584NM3WGF7I',
      title: 'Premium Plan (yearly)',
      amount: 60,
      currency: 'USD',
      interval: 'year',
      intervalCount: 1,
      features: [
        {
          icon: '💾',
          text: '5 GB Storage',
          _id: '66edb1f317812bd55ad87b5f',
        },
        {
          icon: '📦',
          text: 'Store passwords, notes, cards, ID proofs',
          _id: '66edb1f317812bd55ad87b60',
        },
        {
          icon: '👥',
          text: '10 Organizations',
          _id: '66edb1f317812bd55ad87b61',
        },
        {
          icon: '📧',
          text: '100 User Invitations',
          _id: '66edb1f317812bd55ad87b62',
        },
        {
          icon: '🔑',
          text: '100 Shares',
          _id: '66edb1f317812bd55ad87b63',
        },
      ],
      buttonLink: '/auth/signup',
      buttonText: 'Buy Now',
      hasTrial: true,
      queryParams: {
        plan: 'premium',
        action: 'purchase',
      },
      trialLink: '/auth/signup',
      trialQueryParams: {
        plan: 'premium',
        action: 'trial',
      },
    },
    {
      id: 'P-5GV04444VF2894031M3VR2MY',
      title: 'Premium Plan (Monthly)',
      amount: 6,
      currency: 'USD',
      interval: 'month',
      intervalCount: 1,
      features: [
        {
          icon: '💾',
          text: '5 GB Storage',
          _id: '66edb1f317812bd55ad87b65',
        },
        {
          icon: '📦',
          text: 'Store passwords, notes, cards, ID proofs',
          _id: '66edb1f317812bd55ad87b66',
        },
        {
          icon: '👥',
          text: '10 Organizations',
          _id: '66edb1f317812bd55ad87b67',
        },
        {
          icon: '📧',
          text: '100 User Invitations',
          _id: '66edb1f317812bd55ad87b68',
        },
        {
          icon: '🔑',
          text: '100 Shares',
          _id: '66edb1f317812bd55ad87b69',
        },
      ],
      buttonLink: '/auth/signup',
      buttonText: 'Buy Now',
      hasTrial: true,
      queryParams: {
        plan: 'premium',
        action: 'purchase',
      },
      trialLink: '/auth/signup',
      trialQueryParams: {
        plan: 'premium',
        action: 'trial',
      },
    },
    {
      id: 'P-93233881XJ483274HM3WGPGA',
      title: 'Basic Plan (Yearly)',
      amount: 40,
      currency: 'USD',
      interval: 'year',
      intervalCount: 1,
      features: [
        {
          icon: '💾',
          text: '1 GB Storage',
          _id: '66edb1f317812bd55ad87b6b',
        },
        {
          icon: '📦',
          text: 'Store passwords, notes, cards, ID proofs',
          _id: '66edb1f317812bd55ad87b6c',
        },
        {
          icon: '👥',
          text: '2 Organizations',
          _id: '66edb1f317812bd55ad87b6d',
        },
        {
          icon: '📧',
          text: '15 User Invitations',
          _id: '66edb1f317812bd55ad87b6e',
        },
        {
          icon: '🔑',
          text: '15 Shares',
          _id: '66edb1f317812bd55ad87b6f',
        },
      ],
      buttonLink: '/auth/signup',
      buttonText: 'Buy Now',
      hasTrial: true,
      queryParams: {
        plan: 'basic',
        action: 'purchase',
      },
      trialLink: '/auth/signup',
      trialQueryParams: {
        plan: 'basic',
        action: 'trial',
      },
    },
    {
      id: 'P-85R761525X622673PM3WGOTQ',
      title: 'Basic Plan (Monthly)',
      amount: 4,
      currency: 'USD',
      interval: 'month',
      intervalCount: 1,
      features: [
        {
          icon: '💾',
          text: '1 GB Storage',
          _id: '66edb1f317812bd55ad87b71',
        },
        {
          icon: '📦',
          text: 'Store passwords, notes, cards, ID proofs',
          _id: '66edb1f317812bd55ad87b72',
        },
        {
          icon: '👥',
          text: '2 Organizations',
          _id: '66edb1f317812bd55ad87b73',
        },
        {
          icon: '📧',
          text: '15 User Invitations',
          _id: '66edb1f317812bd55ad87b74',
        },
        {
          icon: '🔑',
          text: '15 Shares',
          _id: '66edb1f317812bd55ad87b75',
        },
      ],
      buttonLink: '/auth/signup',
      buttonText: 'Buy Now',
      hasTrial: true,
      queryParams: {
        plan: 'basic',
        action: 'purchase',
      },
      trialLink: '/auth/signup',
      trialQueryParams: {
        plan: 'basic',
        action: 'trial',
      },
    },
    {
      id: 'P-683760842Y234025BM3WGQ6Y',
      title: 'Enterprise Plan (Yearly)',
      amount: 100,
      currency: 'USD',
      interval: 'year',
      intervalCount: 1,
      features: [
        {
          icon: '📦',
          text: 'Store passwords, notes, cards, ID proofs',
          _id: '66edb1f317812bd55ad87b51',
        },
        {
          icon: '🔐',
          text: 'Passwordless SSO Integration',
          _id: '66edb1f317812bd55ad87b52',
        },
        {
          icon: '💾',
          text: '10 GB Storage',
          _id: '66edb1f317812bd55ad87b53',
        },
        {
          icon: '👥',
          text: 'Unlimited Organizations',
          _id: '66edb1f317812bd55ad87b54',
        },
        {
          icon: '📧',
          text: 'Unlimited User Invitations',
          _id: '66edb1f317812bd55ad87b55',
        },
        {
          icon: '🔑',
          text: 'Unlimited Password Shares',
          _id: '66edb1f317812bd55ad87b56',
        },
      ],
      buttonLink: '/auth/signup',
      buttonText: 'Buy Now',
      hasTrial: true,
      queryParams: {
        plan: 'enterprise',
        action: 'purchase',
      },
      trialLink: '/auth/signup',
      trialQueryParams: {
        plan: 'enterprise',
        action: 'trial',
      },
    },
    {
      id: 'P-959072281U895714BM3WGQCA',
      title: 'Enterprise Plan (Monthly)',
      amount: 10,
      currency: 'USD',
      interval: 'month',
      intervalCount: 1,
      features: [
        {
          icon: '📦',
          text: 'Store passwords, notes, cards, ID proofs',
          _id: '66edb1f317812bd55ad87b58',
        },
        {
          icon: '🔐',
          text: 'Passwordless SSO Integration',
          _id: '66edb1f317812bd55ad87b59',
        },
        {
          icon: '💾',
          text: '10 GB Storage',
          _id: '66edb1f317812bd55ad87b5a',
        },
        {
          icon: '👥',
          text: 'Unlimited Organizations',
          _id: '66edb1f317812bd55ad87b5b',
        },
        {
          icon: '📧',
          text: 'Unlimited User Invitations',
          _id: '66edb1f317812bd55ad87b5c',
        },
        {
          icon: '🔑',
          text: 'Unlimited Password Shares',
          _id: '66edb1f317812bd55ad87b5d',
        },
      ],
      buttonLink: '/auth/signup',
      buttonText: 'Buy Now',
      hasTrial: true,
      queryParams: {
        plan: 'enterprise',
        action: 'purchase',
      },
      trialLink: '/auth/signup',
      trialQueryParams: {
        plan: 'enterprise',
        action: 'trial',
      },
    },
  ];

  strength: number = 0;
  value = 0;
  hide = signal(true);
  showSuccess = false;
  showCancel = false;
  showError = false;
  userId!: string;
  selectedPlan: any;

  public payPalConfig?: IPayPalConfig;

  // Form Controls
  signupForm: FormGroup;

  billingForm = new FormGroup({
    billingAddress: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    postalCode: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
  });

  paymentForm = new FormGroup({
    planType: new FormControl(''),
    planId: new FormControl(''),
    plan_action: new FormControl(''),
  });

  OTPForm = new FormGroup({
    confirmationCode: new FormControl('', Validators.required),
  });

  securityForm = new FormGroup({
    securityQuestion1: new FormControl(''),
    securityAnswer1: new FormControl(''),
    securityQuestion2: new FormControl(''),
    securityAnswer2: new FormControl(''),
  });
  constructor() {
    this.signupForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]{10}'),
      ]),
      password: new FormControl('', [
        Validators.required,
        this.passwordValidator.bind(this),
      ]),
    });
  }
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  ngOnInit(): void {
    this.initPasswordStrengthWatcher();
    this.route.queryParams.subscribe((params: any) => {
      this.isPaidPlan = params['plan'] && params.plan !== 'free';
      this.paymentForm.get('planType')?.setValue(params.plan);

      const planId = params['planId'];
      if (planId) {
        this.paymentForm.get('planId')?.setValue(planId);
        this.selectPlan(planId);
      }
      this.paymentForm.get('plan_action')?.setValue(params.action);
    });
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: 'USD',
        clientId: 'AXBL_2Bz7P3ArXfpL-gwlNjeXwz38eiNCrvTfrUA5efGicHbISs-ZHAW7c3q7iNzwQAFxD3HQczoXIKA',
        createOrderOnClient: (data) => <ICreateOrderRequest> {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: this.selectedPlan.amount,
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: this.selectedPlan.amount,
              },
            },
          },
          items: [{
            name: this.selectedPlan.title,
            quantity: '1',
            category: 'DIGITAL_GOODS',
            unit_amount: {
              currency_code: 'USD',
              value: this.selectedPlan.amount,
            },
          }],
        }],
        billing_cycles: this.getBillingCycles(), // Dynamic billing based on user's choice
      },
      advanced: {
        commit: 'true',
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
      },
      onApprove: (data, actions) => {
        actions.order.get().then((details: any) => {
          this.createSubscription(details);
        });
      },
      onClientAuthorization: (data) => {
        this.showSuccess = true;
      },
      onCancel: (data) => {
        this.showCancel = true;
      },
      onError: (err) => {
        this.showError = true;
        console.error('PayPal error:', err);
      },
      onClick: () => this.resetStatus(),
    };
  }
  
  
  // Dynamic Billing Cycles Function
  private getBillingCycles(): any[] {
    if (this.paymentForm.value.plan_action === 'trial') {
      // 7-day free trial
      return [
        {
          frequency: {
            interval_unit: 'DAY',
            interval_count: 7, // 7-day trial period
          },
          tenure_type: 'TRIAL',
          sequence: 1,
          total_cycles: 1, // Only 1 trial cycle of 7 days
          pricing_scheme: {
            fixed_price: {
              value: '0', // Free for trial period
              currency_code: 'USD',
            },
          },
        },
        {
          frequency: {
            interval_unit: this.selectedPlan.interval,
            interval_count: 1, // Monthly subscription after the trial
          },
          tenure_type: 'REGULAR',
          sequence: 2,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: {
              value: this.selectedPlan.amount,
              currency_code: 'USD',
            },
          },
        },
      ];
    } else {
      return [
        {
          frequency: {
            interval_unit:  this.selectedPlan.interval,
            interval_count: 1, // Monthly subscription
          },
          tenure_type: 'REGULAR',
          sequence: 1,
          total_cycles: 0, // Unlimited cycles
          pricing_scheme: {
            fixed_price: {
              value: this.selectedPlan.amount,
              currency_code: 'USD',
            },
          },
        },
      ];
    }
  }
  
  private resetStatus(): void {
    this.showSuccess = false;
    this.showCancel = false;
    this.showError = false;
  }

  selectPlan(planId: string): void {
    this.selectedPlan = this.plan.find((plan) => plan.id === planId);
    this.paymentForm.patchValue({ planType: this.selectedPlan });
    console.log('Selected Plan:', this.selectedPlan);
  }

  createSubscription(orderDetails: any): void {
    const subscriptionData = {
      userId: this.userId,
      plan: this.paymentForm.value.planType,
      paypalOrderId: orderDetails.id,
    };

    this.planService.createPlan(subscriptionData).subscribe({
      next: (response: any) =>  {
        this.authService.resendCode(this.signupForm.value.email).subscribe({
          next: (res: any) => {
            this.snackbar.open(
              'Subscription created successfully. The email verification code  has been sent to your email. Please check your inbox.',
              'close',
              { duration: 3000 }
            );
            localStorage.setItem(
              'email',
              this.signupForm.value.email?.toString()
            );
            this.router.navigateByUrl('/auth/email-confirmation');
          }
        })
      },
      error: (error: any) =>
        console.error('Error creating subscription:', error),
    });
  }

  onSubmit(): void {
    this.initConfig();

    if (
      this.signupForm.valid &&
      this.billingForm.valid &&
      (!this.isPaidPlan || this.paymentForm.valid)
    ) {
      this.createUser();
    } else {
      this.snackbar.open('Please fill in all required fields', 'close', {
        duration: 3000,
      });
      7;
    }
  }
  getPasswordStrength(): number {
    return this.value;
  }

  generatePassword(): void {
    const passwords = Array(10)
      .fill(
        '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'
      )
      .map(function (x) {
        return x[Math.floor(Math.random() * x.length)];
      })
      .join('');
    this.signupForm.get('password')?.setValue(passwords);
    const result = zxcvbn(passwords);
    this.strength = result.score;
    this.value = (this.strength / 4) * 100;
  }

  getPasswordStrengthLabel(strength: number): string {
    switch (strength) {
      case 0 && this.signupForm.value.password !== null:
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Strong';
      case 4:
        return 'Very Strong';
      default:
        return '';
    }
  }

  createUser(): void {
    const userDetails = {
      ...this.signupForm.value,
      ...this.billingForm.value,
      ...this.paymentForm.value,
    };
    this.authService.signup(userDetails).subscribe({
      next: (response: any) => {
        console.log('ff', response);
        
        this.userId = response.userId;
        if (!this.isPaidPlan) {
          this.snackbar.open(
            'User registered. A confirmation email has been sent.',
            'close',
            { duration: 3000 }
          );
          localStorage.setItem(
            'email',
            this.signupForm.value.email?.toString()
          );
          this.router.navigateByUrl('/auth/email-confirmation');
        }
      },
      error: (error: any) =>
        this.snackbar.open(error.message, 'close', { duration: 3000 }),
    });
  }

  private passwordValidator(
    control: FormControl
  ): { [key: string]: any } | null {
    const result = zxcvbn(control.value);
    this.strength = (result.score + 1) * 20; // Strength percentage
    return result.score < 3 ? { weakPassword: true } : null;
  }

  private initPasswordStrengthWatcher(): void {
    this.signupForm.get('password')?.valueChanges.subscribe((password) => {
      const result = zxcvbn(password);
      this.strength = (result.score + 1) * 20; // Update password strength bar
    });
  }
}
