import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Item } from '../domain/item';
import ITEMS from '../../assets/data/items.json';

@Injectable({
  providedIn: 'root',
})
export class ItemService {

  constructor() { }

  getItems(): Item[] {

    return ITEMS;
  }

  getItem(id: number): Observable<Item> {
    return of(ITEMS.find((item: { id: number; }) => item.id === id));
  }
}
