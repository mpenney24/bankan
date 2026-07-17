import { Exclude, Expose } from "class-transformer";

// DDD - Entity
@Exclude()
export class Ticket {
    // Mitch - maybe try changing the variable names, removing getters/setters, etc.

    constructor(
        private _id: string,
        private _columnId: string,
        private _name: string,
        private _description: string,
        private _created: string = new Date().toISOString(),
        private _updated: string | null = null
    ) {}

    @Expose() 
    get id(): string { return this._id; }
    private set id(id: string) { this._id = id; }

    @Expose() 
    get columnId(): string { return this._columnId; }
    set columnId(columnId: string) { this._columnId = columnId; }

    @Expose() 
    get name(): string { return this._name; }
    set name(name: string) { this._name = name; }

    @Expose() 
    get description(): string { return this._description; }
    set description(description: string) { this._description = description; }

    @Expose() 
    get created(): string { return this._created; }
    private set created(created: string) { this._created = created; }

    @Expose() 
    get updated(): string | null { return this._updated; }
    set updated(updated: string) { this._updated = updated; }

    public transitionTo(newColumnId: string): void {
        this._columnId = newColumnId;
        this._updated = new Date().toISOString();
    }

}