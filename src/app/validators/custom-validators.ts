import { FormArray, FormGroup, Form } from '@angular/forms';
export class CustomValidators {
   static minLengthOfValidAnswers(numberOfAnswers: number) {
       return(a: FormArray) => {
           const isValidArray = a.controls
           .map((c: FormGroup) => c.get('IsCorrect').value as boolean)
           .filter(x => x === true);

           if(isValidArray.length !== numberOfAnswers) {
               return {
                   minLengthOfValidAnswers: {
                       foundAnswers: isValidArray.length,
                       requiredValidAnswers: numberOfAnswers
                   }
               };
           }
           return null;
       };
   }
}