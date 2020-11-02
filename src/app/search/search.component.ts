import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Names } from '../shared/interfaces/names';
import { Person } from '../shared/interfaces/peson';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit {
  p: string;
  form: FormGroup;
  myControl = new FormControl();
  options: string[] = [];
  person: Person = {
    homeworld: 'Homeworld',
    name: 'Character name',
    gender: 'n/a',
  };
  filteredOptions: Observable<string[]>;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Names[]>(`${environment.API_URL}`).subscribe((names) => {
      let opt = this.options
      for (const name of names) {
        opt[opt.length] = name.name;
      }
      this.options = opt.sort();
    });
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(
      (option) => option.toLowerCase().indexOf(filterValue) === 0
    );
  }

  submit(): void {
    this.http
      .get<Person[]>(`${environment.API_URL}/search-people`, {
        params: new HttpParams().set('name', this.myControl.value),
      })
      .subscribe((person) => {
        if(person[0] === undefined){
          this.p = ``;
        } else {
          this.person = person[0];
          this.p = `${ this.person.name } is from ${ this.person.homeworld }.
          ${ this.person.name } is a ${ this.person.gender } gender character.`
        }
      });
  }
}
