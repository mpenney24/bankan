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

    public static combine(results: Result<any>[]): Result<void> {
        for (const result of results) {
            if (result.isFailure) return Result.fail(result.error);
        }
        return Result.ok();
    }

    public map<U>(fn: (value: T) => U): Result<U, E> {
        if (this.isFailure) {
            return Result.fail(this.error);
        }
        return Result.ok(fn(this.value));
    }

    public bind<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
        if (this.isFailure) {
            return Result.fail(this.error);
        }
        return fn(this.value);
    }
}
