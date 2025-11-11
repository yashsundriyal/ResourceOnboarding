import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { MenuComponent } from './menu/menu.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth.guard';
import { SignupComponent } from './signup/signup.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'menu', component: MenuComponent, canActivate: [authGuard]  },
  { path: 'home', component: HomeComponent, canActivate: [authGuard]  },
  { path: 'add', component: AddComponent, canActivate: [authGuard]},
  { path: 'edit/:id', component: EditComponent, canActivate: [authGuard] },
   { path: 'signup', component: SignupComponent}
];