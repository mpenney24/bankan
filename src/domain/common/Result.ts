export class Result<T, E = string> {
    public readonly isSuccess: boolean;
    public readonly isFailure: boolean;
    private readonly _value?: T | undefined;
    private readonly _error?: E | undefined;

    private constructor(isSuccess: boolean, value?: T, error?: E) {
        this.isSuccess = isSuccess;
        this.isFailure = !isSuccess;
        this._value = value;
        this._error = error;
    }

    public static ok<T, E = string>(value?: T): Result<T, E> {
        return new Result<T, E>(true, value, undefined);
    }

    public static fail<T, E = string>(error: E): Result<T, E> {
        return new Result<T, E>(false, undefined, error);
    }

    public get value(): T {
        if (!this.isSuccess) {
            throw new Error("Can't get the value of a failure result.");
        }
        return this._value as T;
    }

    public get error(): E {
        if (this.isSuccess) {
            throw new Error("Can't get the error of a success result.");
        }
        return this._error as E;
    }
}