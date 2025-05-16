// src/models/Item.js
export class Item {
    constructor(data) {
        this.id = data.id
        this.name = data.name
        this.type = data.type  // 'health', 'attack', 'defense', 'cleanse', etc.
        this.value = data.value || 0  // Amount of healing, attack boost, etc.
        this.description = data.description || ''
        this.imgUrl = data.imgUrl || 'https://placehold.co/100x100?text=' + data.name
        this.cost = data.cost || 100  // Gold cost to purchase
        this.oneTimeUse = data.oneTimeUse !== undefined ? data.oneTimeUse : true
    }
}