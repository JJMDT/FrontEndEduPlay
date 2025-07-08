import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { LoginComponent } from './components/login/login.component';
import { Results } from './components/results/results';
import { AdminGuard } from './services/auth/admin.guard';
import { Presentacion } from './components/presentacion/presentacion';
import { Ranking } from './components/ranking/ranking';
import { Questions } from './components/questions/questions';
import { GestionPreguntas } from './components/gestionPreguntas/gestion-preguntas';

export const routes: Routes = [
    {path:'',component:Home},
    {path:"login",component: LoginComponent},
    {path: "resultados", component: Results},
    {path: "presentacion", component: Presentacion},
    {path: 'ranking', component: Ranking },
    {path: 'gestion', component: GestionPreguntas,canActivate: [AdminGuard]},
    {path: 'questions', component: Questions},
];
