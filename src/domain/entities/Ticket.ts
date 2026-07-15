// DDD - Entity
export class Ticket {
    constructor(
        private readonly _id: number,
        private _name: string,
        private _description: string,
        private _stateId: string,
        private readonly _created: Date = new Date(),
        private _updated: Date | null = null
    ) {}

    get id(): number {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }

    get stateId(): string {
        return this._stateId;
    }

    get created(): Date {
        return this._created;
    }

    get updated(): Date | null {
        return this._updated;
    }

    public transitionTo(newStateId: string): void {
        this._stateId = newStateId;
        this._updated = new Date();
    }

}