import { ERROR_CODES } from '../../../errors/ErrorCodes.js';
import { Column } from '../../entities/Column.js';
import { CompositeSpecification } from '../Specification.js';
import { ColumnId } from '../Types.js';

export class ColumnByIdSpec extends CompositeSpecification<Column> {
    public readonly errorMessage: string;

    constructor(public readonly columnId: ColumnId) {
        super();
        this.errorMessage = ERROR_CODES.B00(columnId);
    }

    isSatisfiedBy(column: Column): boolean {
        return column.id === this.columnId;
    }
}

export class ColumnCanBeAddedSpec extends CompositeSpecification<Column> {
    public readonly errorMessage: string;

    constructor(public readonly columnToAdd: Column) {
        super();
        this.errorMessage = ERROR_CODES.UIC01;
    }

    isSatisfiedBy(column: Column): boolean {
        return column.id !== this.columnToAdd.id;
    }
}
