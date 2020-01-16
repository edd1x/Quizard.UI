import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { ICategory } from '../../interfaces/ICategory';
import { CategoryService } from '../../services/categoryService/category.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categoryNames: string[] = [];
  categoryList: ICategory[]; 
  newCategory: string;
  newCategoryId: number; 
  categoryIds: number[] = []; 
  @Input() Categoriess : FormGroup;
  constructor(private toastr: ToastrService, private categoryService: CategoryService) { 
  }

  ngOnInit() {
      this.fetchData();
  }
  private fetchData() {
    let ssv =  this.categoryService.getAll()
      .subscribe(response => {
        this.categoryList = [];
        const results = Array.isArray(response) ? Array.from(response) : [];
        console.warn(results);
        if (results.length > 0) {
          for (let obj of results)
            this.categoryList.push(obj);
        }
      })
      

      return ssv;
  }
  get formStatus() {
    return {
      valid: this.Categoriess.valid,
      dirty: this.Categoriess.dirty,
      touched: this.Categoriess.touched,
      value: this.Categoriess.value
    };
  }
  formatter = (cate: ICategory) => cate.categoryName;

  search = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.categoryList.filter(category => new RegExp(term, 'mi').test(category.categoryName)).slice(0, 10))
  )

  removeCategory(cat: any) {
    var index = this.categoryNames.indexOf(cat);
    this.categoryNames.splice(index, 1);
    this.categoryIds.splice(index, 1);
  }

  

  checkIfStringEmpty(): boolean {
    console.log(this.Categoriess);
    if (this.Categoriess.value.Categories === "" || this.Categoriess.value.Categories === null)
      return true;
    return false;
  }

  checkIfCategorySelected(): boolean {
    if (this.categoryNames.length > 0 && this.categoryNames.includes(this.Categoriess.value.Categories.categoryName))
      return true;
    return false;
  }

  checkIfCategoryExists(): boolean {
    if (this.categoryList.filter(x => x.categoryName == this.Categoriess.value.Categories).length > 0)
      {
        return true;
      }
    return false;
  }

  addAnotherCategory() {
    // nova
    
    if (this.checkIfStringEmpty()) {
      this.toastr.error('You cannot add empty string', 'Error', {
        timeOut: 3000
        
      });
    }
     else if (this.categoryNames.length > 0 && this.categoryNames.includes(this.Categoriess.value.Categories.categoryName)) {
      this.toastr.error('This category is already assigned to question', 'Error', {
        timeOut: 3000
      });
    }
     else if (this.checkIfCategoryExists()) { //true
      if (this.categoryNames.length > 0 && this.categoryNames.includes(this.Categoriess.value.Categories)) {
        this.toastr.error('This category is already assigned to question', 'Error', {
          timeOut: 3000
        });
      }
      else {
        var existingCategory = this.categoryList.filter(x => x.categoryName == this.Categoriess.value.Categories);
        this.categoryIds.push(existingCategory[0].id);
        this.categoryNames.push(existingCategory[0].categoryName);
      }
    } 
    else {
      if (this.Categoriess.value.Categories.id == null) {
        this.Categoriess.value.Categories = this.Categoriess;
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

        this.categoryNames.push(this.Categoriess.value.Categories.categoryName);
        this.categoryIds.push(this.Categoriess.value.Categories.id);
      }
    }
    this.fetchData();
    this.Categoriess.value.Categories.reset();
  }


}
