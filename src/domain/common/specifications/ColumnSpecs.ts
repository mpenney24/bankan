import { CompositeSpecification } from "../Specification.js";
import { ColumnId } from "../Types.js";
import { Column } from "../../entities/Column.js";
import { ERROR_CODES } from "../../../errors/ErrorCodes.js";

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