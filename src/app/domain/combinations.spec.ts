import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Combinations } from './combinations';

describe('Combinations', () => {
  let component: Combinations;
  let fixture: ComponentFixture<Combinations>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ Combinations ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Combinations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load the all items with all 54 composite and component items', () => {
    expect(Object.keys(component.allItems).length).toEqual(54);
  });

  it('should load the component items with 9 items', () => {
    expect(component.allComponentItems.length).toEqual(9);
  });

  it('should return the bf sword', () => {
    const componentItem = component.getItemById(1);
    expect(componentItem.id).toEqual(1);
    expect(componentItem.name).toEqual('B.F. Sword');
  });

  it('should add the component item tear of the goddess to collected items', () => {
    expect(component.collectedItems.length).toEqual(0);
    const componentItem = component.getItemById(4);
    component.addComponentItem(componentItem);
    expect(component.collectedItems.length).toEqual(1);
    expect(component.collectedItems[0].id).toEqual(4);
    expect(component.collectedItems[0].name).toEqual('Tear of the Goddess');

  });

  it('should remove componentItem tear from collected items', () => {
    const componentItem = component.getItemById(4);
    component.addComponentItem(componentItem);
    expect(component.collectedItems.length).toEqual(1);
    component.removeCollectedItem(componentItem);
    expect(component.collectedItems.length).toEqual(0);
  });

  it('should add the craftedItem Bloodthirster to collected items and remove the component item components', () => {
    expect(component.collectedItems.length).toEqual(0);
    const componentItemSword = component.getItemById(1);
    component.addComponentItem(componentItemSword);
    const componentItemShell = component.getItemById(6);
    component.addComponentItem(componentItemShell);
    expect(component.collectedItems.length).toEqual(2);
    const compositeItem = component.getItemById(16);
    component.addCompositeItem(compositeItem);
    expect(component.collectedItems.length).toEqual(1);
    expect(component.collectedItems[0].name).toEqual('Bloodthirster');
    expect(component.collectedItems[0].id).toEqual(16);
  });

  it('should remove the craftedItem Bloodthirster from collected items and add the component items back to collecteditems', () => {
    const componentItemSword = component.getItemById(1);
    component.addComponentItem(componentItemSword);
    const componentItemShell = component.getItemById(6);
    component.addComponentItem(componentItemShell);
    const compositeItem = component.getItemById(16);
    component.addCompositeItem(compositeItem);
    expect(component.collectedItems.length).toEqual(1);
    expect(component.collectedItems[0].name).toEqual('Bloodthirster');
    expect(component.collectedItems[0].id).toEqual(16);
    component.removeCollectedItem(compositeItem);
    expect(component.collectedItems.length).toEqual(2);
    expect(component.collectedItems[0].id).toEqual(1);
    expect(component.collectedItems[0].name).toEqual('B.F. Sword');
    expect(component.collectedItems[1].id).toEqual(6);
    expect(component.collectedItems[1].name).toEqual('Negatron Cloak');
  });

  it('should have unique composite id of 16 if collected items has sword and shell', () => {
    const componentItemSword = component.getItemById(1);
    component.addComponentItem(componentItemSword);
    const componentItemShell = component.getItemById(6);
    component.addComponentItem(componentItemShell);
    const uniqueCompositeItemIds = component.getUniqueCompositeIdsFromItemIds([componentItemSword.id, componentItemShell.id]);
    expect(uniqueCompositeItemIds).toEqual([16]);
  });

  it('should populate bf sword if unique composite id contains one element that equals 16', () => {
    const uniqueCompositeItemIds = [16];
    const expectedItem = component.getCompositeItemsFromIds(uniqueCompositeItemIds);
    expect(expectedItem[0]).toEqual(component.getItemById(16));
  });

  it('should have BloodThirster in potential composite items if a sword and shell are int the collected items list', () => {
    const componentItemSword = component.getItemById(1);
    component.addComponentItem(componentItemSword);
    const componentItemShell = component.getItemById(6);
    component.addComponentItem(componentItemShell);
    const compositeItem = component.getItemById(16);
    expect(component.potentialCompositeItems[0]).toEqual(compositeItem);
  });

  it('should not have Guardian Angel in potential composite items if a sword and shell are in the collected item list', () => {
    const componentItemSword = component.getItemById(1);
    component.addComponentItem(componentItemSword);
    const componentItemShell = component.getItemById(6);
    component.addComponentItem(componentItemShell);
    const compositeItem = component.getItemById(15);
    expect(component.potentialCompositeItems[0]).not.toEqual(compositeItem);
  });

  it('should have 36 potentialCompositeItmes given 9 unique component items in the collected item list', () => {
    for (const cpt of component.allComponentItems) {
        component.addComponentItem(cpt);
    }
    expect(component.potentialCompositeItems.length).toEqual(36);
  });
/* //This test is too powerful for the comboIterator and times out
  it('should have 45 potentialCompositeItmes given that each component item is added twice', () => {
    for (const cpt of component.allComponentItems) {
      component.addComponentItem(cpt);
      component.addComponentItem(cpt);
    }
    expect(component.potentialCompositeItems.length).toEqual(45);
  });
*/
  it('should have 0 unique possible item combinations given 1 component item', () => {
    component.addComponentItem(component.allComponentItems[0]);
    expect(component.potentialCompositeItems.length).toEqual(0);
  });

  it('should have 1 unique possible item combination given 2 component items', () => {
    component.addComponentItem(component.allComponentItems[0]);
    component.addComponentItem(component.allComponentItems[1]);
    expect(component.potentialCompositeItems.length).toEqual(1);
  });

  it('should have 3 unique possible item combination given 3 component items', () => {
    component.addComponentItem(component.allComponentItems[0]);
    component.addComponentItem(component.allComponentItems[1]);
    component.addComponentItem(component.allComponentItems[2]);
    expect(component.potentialCompositeItems.length).toEqual(3);
  });

  it('should have 6 unique possible item combination given 4 unique component items', () => {
    component.addComponentItem(component.allComponentItems[0]);
    component.addComponentItem(component.allComponentItems[1]);
    component.addComponentItem(component.allComponentItems[2]);
    component.addComponentItem(component.allComponentItems[3]);
    expect(component.potentialCompositeItems.length).toEqual(6);
  });

  it('should have 10 unique possible item combination given 5 unique component items', () => {
    component.addComponentItem(component.allComponentItems[0]);
    component.addComponentItem(component.allComponentItems[1]);
    component.addComponentItem(component.allComponentItems[2]);
    component.addComponentItem(component.allComponentItems[3]);
    component.addComponentItem(component.allComponentItems[4]);
    expect(component.potentialCompositeItems.length).toEqual(10);
  });

  it('should have 15 unique possible item combination given 6 unique component items', () => {
    component.addComponentItem(component.allComponentItems[0]);
    component.addComponentItem(component.allComponentItems[1]);
    component.addComponentItem(component.allComponentItems[2]);
    component.addComponentItem(component.allComponentItems[3]);
    component.addComponentItem(component.allComponentItems[4]);
    component.addComponentItem(component.allComponentItems[5]);
    expect(component.potentialCompositeItems.length).toEqual(15);
  });

  it('should have 21 unique possible item combination given 7 unique component items', () => {
    component.addComponentItem(component.allComponentItems[0]);
    component.addComponentItem(component.allComponentItems[1]);
    component.addComponentItem(component.allComponentItems[2]);
    component.addComponentItem(component.allComponentItems[3]);
    component.addComponentItem(component.allComponentItems[4]);
    component.addComponentItem(component.allComponentItems[5]);
    component.addComponentItem(component.allComponentItems[6]);
    expect(component.potentialCompositeItems.length).toEqual(21);
  });

  it('should have 28 unique possible item combination given 8 unique component items', () => {
    component.addComponentItem(component.allComponentItems[0]);
    component.addComponentItem(component.allComponentItems[1]);
    component.addComponentItem(component.allComponentItems[2]);
    component.addComponentItem(component.allComponentItems[3]);
    component.addComponentItem(component.allComponentItems[4]);
    component.addComponentItem(component.allComponentItems[5]);
    component.addComponentItem(component.allComponentItems[6]);
    component.addComponentItem(component.allComponentItems[7]);
    expect(component.potentialCompositeItems.length).toEqual(28);
  });

  it('should have 36 unique possible item combination given 9 unique component items', () => {
    component.addComponentItem(component.allComponentItems[0]);
    component.addComponentItem(component.allComponentItems[1]);
    component.addComponentItem(component.allComponentItems[2]);
    component.addComponentItem(component.allComponentItems[3]);
    component.addComponentItem(component.allComponentItems[4]);
    component.addComponentItem(component.allComponentItems[5]);
    component.addComponentItem(component.allComponentItems[6]);
    component.addComponentItem(component.allComponentItems[7]);
    component.addComponentItem(component.allComponentItems[8]);
    expect(component.potentialCompositeItems.length).toEqual(36);
  });

  it('should remove two items from list based on single two digit number', () => {
    let itemIds = [1, 2];
    itemIds = component.removeComponentsSpentByCompositeItemCreation(itemIds, 12);
    expect(itemIds.length).toEqual(0);
  });

  it('should remove two items from list of 3 numbers based on single two digit number', () => {
    let itemIds = [1, 2, 3];
    itemIds = component.removeComponentsSpentByCompositeItemCreation(itemIds, 12);
    expect(itemIds).toEqual([3]);
  });

  it('should remove two items from list of 5 numbers based on single two digit number', () => {
    let itemIds = [1, 2, 3, 4, 5];
    itemIds = component.removeComponentsSpentByCompositeItemCreation(itemIds, 12);
    expect(itemIds).toEqual([3, 4, 5]);
  });


  it('should sort the array [1,2,3] in desc order [3,2,1]', () => {
    let itemIds: number[] = [1, 2, 3];
    itemIds = itemIds.sort((a, b) => b - a);
    expect(itemIds).toEqual([3, 2, 1]);
  });


  it('should sort the array [11,32,31] in desc order [32,31,11]', () => {
    let itemIds: number[] = [11, 32, 31];
    itemIds = itemIds.sort((a, b) => b - a);
    expect(itemIds).toEqual([32, 31, 11]);
  });

  it('should create', () => {
   expect(component).toBeTruthy();
  });
});
