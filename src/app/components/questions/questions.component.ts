import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map,filter } from 'rxjs/operators';
import { ICategory } from '../../interfaces/ICategory';
import { CategoryService } from '../../services/categoryService/category.service';
import { QuestionService } from './../../services/questionService/question.service';
import { CustomValidators } from './../../validators/custom-validators';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: [
    './questions.component.css'
]
})
export class QuestionsComponent implements OnInit {
  model: string[]=[];
  form: FormGroup;
  formattedMessage: string;
  category: ICategory[];
  newCategory:string;
  CategoryInt: number []=[];
  constructor(private fb: FormBuilder, private questionService: QuestionService,
     private toastr: ToastrService, private categoryService: CategoryService) { }

  ngOnInit() {
    this.fetchData();
    this.form = this.fb.group({
      Text: this.fb.control('', Validators.required),
      Categories:[],
      answers: this.fb.array(
        [this.answerGroup(), this.answerGroup()],
        [ CustomValidators.minLengthOfValidAnswers(1), Validators.required]
      )
    });

  }
  private fetchData(){
    return this.categoryService.getAll()
               .subscribe(response => {
                 this.category=[];
                 const results = Array.isArray(response) ? Array.from(response) : [];
                 if (results.length > 0) {
                   for (let obj of results)
                    this.category.push(obj);
                 }
               })
  }
  formatter = (cate: ICategory) => cate.categoryName;

  search = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.category.filter(category => new RegExp(term, 'mi').test(category.categoryName)).slice(0, 10))
  )

 

categoryGroup():FormGroup{
  return this.fb.group({
      categoryName: this.fb.control(''),
    });
}
  get categoryArray():FormArray{
    return this.form.get('categoryArray') as FormArray;
  }
  addAnotherCategory() {
 
      if (this.form.value.Categories.id == null)
      {
        this.newCategory = this.form.value.Categories;
        console.log(this.newCategory);
        var nova = {
          categoryName :this.newCategory
        }
        var nova2 = JSON.stringify(nova);
        console.log(nova2);
        this.categoryService.postCategory(nova2).subscribe(response=>this.CategoryInt.push(Number.parseInt(response.toString())));
        this.model.push(this.newCategory);
      }
      else{

      this.model.push(this.form.value.Categories.categoryName);
      this.CategoryInt.push(this.form.value.Categories.id);

      JSON.stringify(this.model);
      console.log(this.model);
      console.log(this.CategoryInt);
     
    }
    this.form.value.Categories.reset;
  }


  answerGroup(): FormGroup {
    return this.fb.group({
      Text: this.fb.control('', Validators.required),
      IsCorrect: false
    });
  }
  get answersArray(): FormArray {
    return this.form.get('answers') as FormArray;
  }
  addAnotherAnswer() {
    this.answersArray.push(this.answerGroup());
  }
  get removeButtonDisabled(): boolean {
    return this.answersArray.length === 2;
  }
 
  removeAnswer(i: number) {
    this.answersArray.removeAt(i);
  }
  addQuestion(form) {
    let nesto = form.value;
    nesto.Categories = this.CategoryInt;
    console.log(nesto);
    const credentials = JSON.stringify(nesto);
    
    this.questionService.checkAuth(credentials).subscribe(response => {
      this.toastr.success('Inserted to database!', 'Success');
      this.form.reset();

    }, err => {
      this.toastr.error('Couldn\'t insert to database', 'Error', {
        timeOut: 3000
      });
    });
  }

  get addQuestionButtonDisable(): boolean {
    return !this.form.valid;
  }
  get formStatus() {
    return {
      valid: this.form.valid,
      dirty: this.form.dirty,
      touched: this.form.touched,
      value: this.form.value
    };
  }



}
