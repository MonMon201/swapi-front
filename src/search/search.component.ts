import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { names } from '../shared/interfaces/names';
import { person } from '../shared/interfaces/peson';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  form: FormGroup;
  myControl = new FormControl();
  options: string[] = [];
  person: person = {
    homeworld: 'Homeworld',
    name: 'Character name',
    gender: 'n/a',
  };
  filteredOptions: Observable<string[]>;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<names[]>(`${environment.API_URL}`).subscribe((names) => {
      for (const name of names) {
        this.options[this.options.length] = name.name;
      }
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
      .get<[person]>(`${environment.API_URL}/search-people`, {
        params: new HttpParams().set('name', this.myControl.value),
      })
      .subscribe((person) => {
        this.person = person[0];
      });
  }
}
