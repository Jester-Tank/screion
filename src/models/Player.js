// src/models/Player.js
import { Character } from "./Character.js"

export class Player extends Character {
    constructor(data) {
        super(data)
        this.exp = data.exp || 0
        this.level = data.level || 1
        this.items = data.items || []
    }
}