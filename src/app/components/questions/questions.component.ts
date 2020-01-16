import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
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
  categoryNames: string[] = [];
  form: FormGroup; 
  categoryList: ICategory[]; 
  newCategory: string;
  newCategoryId: number; 
  categoryIds: number[] = []; 

  constructor(private fb: FormBuilder, private questionService: QuestionService,
    private toastr: ToastrService, private categoryService: CategoryService) { }

  ngOnInit() {
    this.fetchData();
    this.form = this.fb.group({
      Text: this.fb.control('', Validators.required),
      Categories: [],
      answers: this.fb.array(
        [this.answerGroup(), this.answerGroup()],
        [CustomValidators.minLengthOfValidAnswers(1), Validators.required]
      )
    });
  }

  private fetchData() {
    return this.categoryService.getAll()
      .subscribe(response => {
        this.categoryList = [];
        const results = Array.isArray(response) ? Array.from(response) : [];
        if (results.length > 0) {
          for (let obj of results)
            this.categoryList.push(obj);
        }
      })
  }

  formatter = (cate: ICategory) => cate.categoryName;

  search = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.categoryList.filter(category => new RegExp(term, 'mi').test(category.categoryName)).slice(0, 10))
  )

  categoryGroup(): FormGroup {
    return this.fb.group({
      categoryName: this.fb.control(''),
    });
  }

  removeCategory(cat: any) {
    var index = this.categoryNames.indexOf(cat);
    this.categoryNames.splice(index, 1);
    this.categoryIds.splice(index, 1);
  }

  get Category() {
    return this.form.get("Categories");
  }

  checkIfStringEmpty(): boolean {
    if (this.form.value.Categories == "" || this.form.value.Categories == undefined)
      return true;
    return false;
  }

  checkIfCategorySelected(): boolean {
    if (this.categoryNames.length > 0 && this.categoryNames.includes(this.form.value.Categories))
      return true;
    return false;
  }

  checkIfCategoryExists(): boolean {
    if (this.categoryList.filter(x => x.categoryName == this.form.value.Categories).length > 0)
      return true;
    return false;
  }

  addAnotherCategory() {
    // nova
    if (this.checkIfStringEmpty()) {
      this.toastr.error('You cannot add empty string', 'Error', {
        timeOut: 3000
      });
    } else if (this.checkIfCategorySelected()) {
      this.toastr.error('This category is already assigned to question', 'Error', {
        timeOut: 3000
      });
    } else if (this.checkIfCategoryExists()) {
      if (this.checkIfCategorySelected()) {
        this.toastr.error('This category is already assigned to question', 'Error', {
          timeOut: 3000
        });
      }
      else {
        console.log("im horny")

        var existingCategory = this.categoryList.filter(x => x.categoryName == this.form.value.Categories);
        this.categoryIds.push(existingCategory[0].id);
        this.categoryNames.push(existingCategory[0].categoryName);
      }
    } 
    else {
      if (this.form.value.Categories.id == null) {
        this.newCategory = this.form.value.Categories;
        var nova = {
          categoryName: this.newCategory
        }
        var nova2 = JSON.stringify(nova);
        this.categoryService.postCategory(nova2).subscribe(response => {
          this.newCategoryId = Number.parseInt(response.toString());
          this.toastr.success('Category successfully added to database', 'Success');
          this.fetchData();
          this.categoryIds.push(this.newCategoryId);
          this.categoryNames.push(this.newCategory);
        }
        );
      }
      else {

        this.categoryNames.push(this.form.value.Categories.categoryName);
        this.categoryIds.push(this.form.value.Categories.id);
      }
    }
    this.fetchData();
    this.form.controls["Categories"].reset();
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
    if (this.form.invalid || this.categoryIds.length < 1) {
      return;
    }
    else {
      let formValues = form.value;
      formValues.Categories = this.categoryIds;
      const credentials = JSON.stringify(formValues);

      this.questionService.checkAuth(credentials).subscribe(response => {
        this.toastr.success('Inserted to database!', 'Success');
        this.form.reset();
        this.categoryIds = [];
        this.categoryNames = [];
        console.log(this.categoryIds);

      }, err => {
        this.toastr.error('Couldn\'t insert to database', 'Error', {
          timeOut: 3000
        });
      });
    }
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