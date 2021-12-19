import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    addItem (count, unit ,ingredient){
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }

    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id);
        //[2,4,8] splice(1,1) --> return 4,original array is [2,8]
        //[2,4,8,10] splice(1,2) --> return [4,8]original array is [2,10] the last number in the box determines how many elements you need take
        //[2,4,8] slice(1,1) --> return 4,original array is [2,8] the last number in the box is the end index
        this.item.splice(index,1);
    }

    updateCount(id, newCount) {
        this.items.find(el => el.id === id).count = newCount;
    }
}