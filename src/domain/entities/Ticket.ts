import { Exclude, Expose } from "class-transformer";

// DDD - Entity
export class Ticket {
    constructor(
        private readonly _id: string,
        private _columnId: string,
        private _name: string,
        private _description: string,
        private readonly _created: string = new Date().toISOString(),
        private _updated: string | null = null
    ) {}

    @Exclude() get id(): string { return this._id; }

    @Expose({ name: 'columnId' }) 
    get columnId(): string { return this._columnId; }
    set columnId(columnId: string) { this._columnId = columnId; }

    @Expose({ name: 'name' }) 
    get name(): string { return this._name; }
    set name(name: string) { this._name = name; }

    @Expose({ name: 'description' }) 
    get description(): string { return this._description; }
    set description(description: string) { this._description = description; }

    @Expose({ name: 'created' }) 
    get created(): string { return this._created; }

    @Expose({ name: 'updated' }) 
    get updated(): string | null { return this._updated; }
    set updated(updated: string) { this._updated = updated; }

    public transitionTo(newColumnId: string): void {
        this._columnId = newColumnId;
        this._updated = new Date().toISOString();
    }

}