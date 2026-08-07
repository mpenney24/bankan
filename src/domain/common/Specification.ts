export interface ISpecification<T> {
    errorMessage?: string;

    isSatisfiedBy(item: T): boolean;
    and(other: ISpecification<T>): ISpecification<T>;
    or(other: ISpecification<T>): ISpecification<T>;
    not(): ISpecification<T>;
}

export abstract class CompositeSpecification<T> implements ISpecification<T> {
    abstract isSatisfiedBy(item: T): boolean;

    and(other: ISpecification<T>): ISpecification<T> {
        return new AndSpecification(this, other);
    }

    or(other: ISpecification<T>): ISpecification<T> {
        return new OrSpecification(this, other);
    }

    not(): ISpecification<T> {
        return new NotSpecification(this);
    }
}

class AndSpecification<T> extends CompositeSpecification<T> {
    constructor(
        private left: ISpecification<T>,
        private right: ISpecification<T>
    ) {
        super();
    }
    isSatisfiedBy(item: T): boolean {
        return this.left.isSatisfiedBy(item) && this.right.isSatisfiedBy(item);
    }
}

class OrSpecification<T> extends CompositeSpecification<T> {
    constructor(
        private left: ISpecification<T>,
        private right: ISpecification<T>
    ) {
        super();
    }
    isSatisfiedBy(item: T): boolean {
        return this.left.isSatisfiedBy(item) || this.right.isSatisfiedBy(item);
    }
}

class NotSpecification<T> extends CompositeSpecification<T> {
    constructor(private spec: ISpecification<T>) {
        super();
    }
    isSatisfiedBy(item: T): boolean {
        return !this.spec.isSatisfiedBy(item);
    }
}
