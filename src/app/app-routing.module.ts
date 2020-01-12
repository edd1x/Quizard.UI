import { QuestionsComponent } from './components/questions/questions.component';
import { NgModule } from '@angular/core';  
import { Routes, RouterModule } from '@angular/router';  
import { HomeComponent } from './components/home/home.component';  
import { AuthGuard } from './services/guards/auth-guard.service';
import { LoginComponent } from './components/login/login.component';  

const routes: Routes = [  
  {  
    path: '',  
    component: HomeComponent,
    data: {  
      title: 'Home'   
    }  
  },  
  {  
    path: 'login',  
    component: LoginComponent,  
    data: {  
      title: 'Login'  
    }  
  },  
  {  
    path: 'questions',  
    component: QuestionsComponent,  
    data: {  
      title: 'Questions'  
    },
    canActivate: [AuthGuard] 
  }  
];  
@NgModule({  
  imports: [RouterModule.forRoot(routes)],  
  exports: [RouterModule]  
})  
export class AppRoutingModule { } 