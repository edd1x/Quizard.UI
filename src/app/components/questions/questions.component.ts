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
  
  form: FormGroup;

  constructor(private fb: FormBuilder, private questionService: QuestionService,
    private toastr: ToastrService, private categoryService: CategoryService) { }

  ngOnInit() {
    this.form = this.fb.group({
      Text: this.fb.control('', Validators.required),
      Categories: [],
      answers: this.fb.array(
        [this.answerGroup(), this.answerGroup()],
        [CustomValidators.minLengthOfValidAnswers(1), Validators.required]
      )
    });
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
    if (this.form.invalid ) {
      return;
    }
    else {
      let formValues = form.value;
      const credentials = JSON.stringify(formValues);

      this.questionService.checkAuth(credentials).subscribe(response => {
        this.toastr.success('Inserted to database!', 'Success');
        this.form.reset();

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