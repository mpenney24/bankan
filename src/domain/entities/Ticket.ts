import { Expose } from "class-transformer";
import { ITicket } from "./TicketSchema.js";

// DDD - Entity
export class Ticket implements ITicket {

    private _id: string;
    private _columnId: string;
    private _name: string;
    private _description: string;
    private _priority: string;
    private _created: string;
    private _updated: string | undefined;

    private constructor(payload: ITicket) {
        this._id = payload?.id;
        this._columnId = payload?.columnId;
        this._name = payload?.name;
        this._description = payload?.description;
        this._priority = payload?.priority;
        this._created = payload?.created;
        this._updated = payload?.updated;
    }

    @Expose() get id(): string { return this._id; }
    private set id(id: string) { this._id = id; }

    @Expose() get columnId(): string { return this._columnId; }
    set columnId(columnId: string) { this._columnId = columnId; }

    @Expose() get name(): string { return this._name; }
    set name(name: string) { this._name = name; }

    @Expose() get description(): string { return this._description; }
    set description(description: string) { this._description = description; }

    @Expose() get priority(): string { return this._priority; }
    set priority(priority: string) { this._priority = priority; }

    @Expose() get created(): string { return this._created; }
    private set created(created: string) { this._created = created; }

    @Expose() get updated(): string | undefined { return this._updated; }
    set updated(updated: string) { this._updated = updated; }

    public transitionTo(newColumnId: string): void {
        this._columnId = newColumnId;
        this._updated = new Date().toISOString();
    }

    static create(payload: Omit<ITicket, 'id' | 'created'>): Ticket {
        return new Ticket({
            id: crypto.randomUUID(),
            created: new Date().toISOString(),
            ...payload
        });
    }

}

// ALTERNATIVE IMPL

// https://www.typescriptlang.org/docs/handbook/2/classes.html#getters--setters
//  "Note that a field-backed get/set pair with no extra logic is very rarely useful in JavaScript. 
//   It’s fine to expose public fields if you don’t need to add additional logic during the get/set operations."

// Despite the above, I decided that strict encapsulation was the better choice for DDD, ensuring that only the 
//  proper accessors/mutators were able to change certain fields (like updated at the same time as columnId).
// Boilerplate getters/setters were also deemed preferable because of:
//  A) explicit determining of which variables should be exposed to the mapping, and
//  B) not to base my model design around the mapper being used, which is bad design (especially if a different
//   mapper wants to be substituted in the future)

// I can see the benefits of the impl below, however... I'm not married to either option!

// import { Expose } from "class-transformer";

// @Expose()
// export class Ticket {
//     constructor(
//         readonly id: string,
//         public columnId: string,
//         public name: string,
//         public description: string,
//         readonly created: string = new Date().toISOString(),
//         public updated: string | null = null
//     ) {}

//     public transitionTo(newColumnId: string): void {
//         if (this.columnId === newColumnId) return;
        
//         this.columnId = newColumnId;
//         this.updated = new Date().toISOString();
//     }
// }