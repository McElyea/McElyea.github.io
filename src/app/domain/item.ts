export class Item {
    id: number;
    name: string;

    constructor(id: any){
        let thisid = 0;
        if (typeof id === 'string')
        {
            thisid = +id;
        }
        else{
            thisid = id;
        }
        this.id = id;
    }
}

export function isComponentItem(id: number, index, array){
    return id <= 9;
}

export function isCompositeItem(id: number, index, array){
    return id > 9;
}
