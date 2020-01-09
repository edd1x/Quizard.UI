import { QuestionService } from './../../services/questionService/question.service';
import { CustomValidators } from './../../validators/custom-validators';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ICategory } from '../../interfaces/ICategory';
import { CategoryService } from 'src/app/services/categoryService/category.service';




@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: [
    './questions.component.css'
]
})
export class QuestionsComponent implements OnInit {

  form: FormGroup;
  formattedMessage: string;
  category: ICategory[];

  constructor(private fb: FormBuilder, private questionService: QuestionService, private toastr: ToastrService, private categoryService: CategoryService) { }

  ngOnInit() {
    this.fetchData();
    this.form = this.fb.group({
      questionText: this.fb.control('', Validators.required),
      categoryArray:[],
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
                    this.category.push(obj.categoryName);
                 }
               })
  }
  answerGroup() : FormGroup {
    return this.fb.group({
      answerText: this.fb.control('', Validators.required),
      correct: false
    })
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
    let credentials = JSON.stringify(form.value);
    console.log(form.value);
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
