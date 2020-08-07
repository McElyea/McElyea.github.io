import { Component, OnInit } from '@angular/core';
import { Combinations } from './domain/combinations';
import { Item } from './domain/item';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'tft-combinator';
  combinations: Combinations;

  ngOnInit(){
    this.combinations = new Combinations();
  }

}
