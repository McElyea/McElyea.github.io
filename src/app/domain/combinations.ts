import { Item } from './item';
import { ItemService } from '../services/item.service';

export class Combinations {
  public allItems: { [key: number]: Item } = {};
  private collectedItemIds: number[] = [];
  private potentialCompositeItemIds: number[] = [];
  private itemCombinationIds: number[][] = [];
  private combinations: {[key: string]: number[]} = {};

  // These are used by the HTML
  public allComponentItems: Item[] = [];
  public collectedItems: Item[] = [];
  public potentialCompositeItems: Item[] = [];
  public itemCombinations: Item [][] = [];

  constructor(private itemService?: ItemService) {
    if (this.itemService === undefined){
      this.itemService = new ItemService();
    }
    this.loadAllItems();
    this.loadAllComponentItems();
  }

  private loadAllItems(): void {
    const items = this.itemService.getItems();
    for (const item of items){
      this.allItems[item.id] = item;
    }
  }

  private loadAllComponentItems(): void {
    this.allComponentItems = [];
    for (let i = 1; i <= 9; i++) {
      this.allComponentItems.push(this.allItems[i]);
    }
  }

  public addComponentItem(item: Item): void {
    this.pushItemToCollectedItems(item);
    this.updateCraftableItems();
  }

  public addCompositeItem(item: Item): void {
    this.pushItemToCollectedItems(item);
    const itemFirstDigit = Math.floor(item.id / 10);
    const itemSecondDigit = item.id % 10;
    const newItem1 = this.getItemById(itemFirstDigit);
    const newItem2 = this.getItemById(itemSecondDigit);
    this.removeCollectedItem(newItem1, false);
    this.removeCollectedItem(newItem2, true);
  }

  public removeCollectedItem(item: Item, update?: boolean): void {
    if (item.id > 9) {
      const itemFirstDigit = Math.floor(item.id / 10);
      const itemSecondDigit = item.id % 10;
      const newItem1 = this.getItemById(itemFirstDigit);
      const newItem2 = this.getItemById(itemSecondDigit);
      this.pushItemToCollectedItems(newItem1);
      this.pushItemToCollectedItems(newItem2);
    }
    const itemIndex = this.collectedItems.indexOf(item);
    this.collectedItems.splice(itemIndex, 1);
    const itemIdIndex = this.collectedItemIds.indexOf(item.id);
    this.collectedItemIds.splice(itemIdIndex, 1);
    if (update === undefined || update){
      this.updateCraftableItems();
    }
  }

  private pushItemToCollectedItems(item: Item){
    this.collectedItems.push(item);
    this.collectedItemIds.push(item.id);
  }

  private updateCraftableItems(): void {
    this.updateCurrentPotentialCompositeItems();
    this.updateCombinations();
  }

  private updateCurrentPotentialCompositeItems() {
    this.potentialCompositeItemIds = this.getUniqueCompositeIdsFromItemIds(this.collectedItemIds);
    this.potentialCompositeItems = this.getCompositeItemsFromIds(this.potentialCompositeItemIds);
  }

  public getCompositeItemsFromIds(itemIds: number[]): Item[]{
    const returnItems: Item[] = [];
    for (const itemId of itemIds){
      returnItems.push(this.getItemById(itemId));
    }
    return returnItems;
  }
  public getUniqueCompositeIdsFromItemIds(itemIds: number[]): number[] {
    const uniqueCraftableItemIds: number[] = [];
    const max = itemIds.length;
    if (max >= 2) {
      for (let i = 0; i < max; i++) {
        for (let j = i + 1; j < max; j++) {
          let firstId = itemIds[i];
          let secondId = itemIds[j];
          if (firstId > 9 || secondId > 9){
            continue;
          }
          if (firstId > secondId){
            const tempId = secondId;
            secondId = firstId;
            firstId = tempId;
          }
          const newItemId = this.allItems[(firstId * 10 + secondId)].id;
          if (!uniqueCraftableItemIds.includes(newItemId)) {
            uniqueCraftableItemIds.push(newItemId);
          }
        }
      }
    }
    return uniqueCraftableItemIds;
  }

  public getItemById(itemId: number): Item{
    return this.allItems[itemId];
  }

  private updateCombinations(): void {
    this.initializeCombinations();
    if (this.collectedItems.length < 2) {
      return;
    }
    this.updateCurrentPotentialCompositeItems();
    this.iterateCombinations(this.collectedItemIds.filter(isComponentItem));
    this.removePartialCombinations();
    this.updateFinalItemCombinations();
  }

  private  initializeCombinations() {
    this.itemCombinations = [];
    this.itemCombinationIds = [];
    this.combinations = {};
  }

  private removePartialCombinations() {
    const workingCombinations: number[][] = [];
    const keys = Object.keys(this.combinations);
    let greatestCompositeItemIdsLength = 0;
    for (const key of keys){
      const itemIds: number[] = this.combinations[key];
      workingCombinations.push(itemIds);
      const numberOfCompositeItemIds = itemIds.filter(isCompositeItem).length || 0;
      if (numberOfCompositeItemIds > greatestCompositeItemIdsLength){
        greatestCompositeItemIdsLength = numberOfCompositeItemIds;
      }
    }
    const finalItemCombos: number[][] = [];
    if (workingCombinations.length > 1){
      for (const finalCombo of workingCombinations){
        if (finalCombo.filter(isCompositeItem).length === greatestCompositeItemIdsLength){
          finalItemCombos.push(finalCombo);
        }
      }
    }
    else{
      finalItemCombos.push(workingCombinations[0]);
    }
    this.itemCombinationIds = finalItemCombos;
  }

  private updateFinalItemCombinations(): void{
    this.itemCombinations = [];
    const combinationIds: number[][] = cloneArray(this.itemCombinationIds);
    const comboIdsLength = combinationIds.length;
    if (comboIdsLength === 0) { return ; }
    const finalComboItems: Item[][] = [];
    for (let i = 0; i < comboIdsLength; i++){
      const itemIds = combinationIds[i];
      const itemIdsLength = itemIds.length;
      const currentCombination: Item[] = [];
      for (let j = 0; j < itemIdsLength; j++){
        const itemId: number = itemIds[j];
        currentCombination.push(this.getItemById(itemId));
      }
      finalComboItems.push(currentCombination);
    }
    this.itemCombinations = finalComboItems;
  }

  private iterateCombinations(itemIds: number[]): void{
    if (itemIds.length <= 1) { return; }
    const currentItemIds = cloneArray(itemIds);
    const componentItemIds = currentItemIds.filter(isComponentItem);
    const uniqueCompositeIds = this.getUniqueCompositeIdsFromItemIds(componentItemIds);
    for (const currentCompositeItemId of uniqueCompositeIds){
      const currentCombination: number[] = [];
      currentCombination.push(currentCompositeItemId);
      const remainingItemIds = this.removeComponentsSpentByCompositeItemCreation(currentItemIds, currentCompositeItemId);
      for (const remainingItemId of remainingItemIds){
        currentCombination.push(remainingItemId);
      }
      currentCombination.sort((a, b) => b - a);
      const key = getKey(currentCombination);
      this.combinations[key] = currentCombination;
      if (remainingItemIds.length > 1){
        this.iterateCombinations(currentCombination);
      }
    }
  }


  public removeComponentsSpentByCompositeItemCreation(collectedComponentItemIds: number[], itemId: number): number[]{
    const transformedComponentItemIds = cloneArray(collectedComponentItemIds);
    const itemTensDecimalPlace = Math.floor(itemId / 10);
    const itemOnesDecimalPlace = itemId % 10;
    const itemInitemTensIndex = transformedComponentItemIds.indexOf(itemTensDecimalPlace);
    transformedComponentItemIds.splice(itemInitemTensIndex, 1);
    const itemInitemOnesIndex = transformedComponentItemIds.indexOf(itemOnesDecimalPlace);
    transformedComponentItemIds.splice(itemInitemOnesIndex, 1);
    return transformedComponentItemIds;
  }

}

function cloneArray(arr: any[]) {
  const returnArray = [];
  for (const item of arr){
    returnArray.push(item);
  }
  return returnArray;
}

function isComponentItem(id: number, index, array){
  return id <= 9;
}

function isCompositeItem(id: number, index, array){
  return id > 9;
}


function getKey(ids: number[]){
  let key = '';
  for (const id of ids){
    key = key + '[' + id + ']';
  }
  return key;
}
