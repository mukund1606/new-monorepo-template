/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/unified-signatures */
/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters */
export type OperationSuccess<T> = {
  data: T;
  error: undefined;
};
export type OperationFailure<E> = {
  data: undefined;
  error: E;
};
export type OperationResult<T, E> = OperationSuccess<T> | OperationFailure<E>;

type Operation<T> = Promise<T> | (() => T) | (() => Promise<T>);

export function trycatch<T, E = Error>(
  operation: Promise<T>,
): Promise<OperationResult<T, E>>;
export function trycatch<T, E = Error>(operation: () => never): OperationResult<never, E>;
export function trycatch<T, E = Error>(
  operation: () => Promise<T>,
): Promise<OperationResult<T, E>>;
export function trycatch<T, E = Error>(operation: () => T): OperationResult<T, E>;
export function trycatch<T, E = Error>(
  operation: Operation<T>,
): OperationResult<T, E> | Promise<OperationResult<T, E>> {
  try {
    const result = typeof operation === "function" ? operation() : operation;

    if (isPromise(result)) {
      return Promise.resolve(result)
        .then((data) => onSuccess(data))
        .catch((error: unknown) => onFailure(error));
    }

    return onSuccess(result);
  } catch (error) {
    return onFailure<E>(error);
  }
}

const onSuccess = <T>(value: T): OperationSuccess<T> => {
  return {
    data: value,
    error: undefined,
  };
};

const onFailure = <E>(error: unknown): OperationFailure<E> => {
  const errorParsed = error instanceof Error ? error : new Error(String(error));
  return {
    data: undefined,
    error: errorParsed as E,
  };
};

const isPromise = <T = unknown>(value: unknown): value is Promise<T> => {
  return (
    !!value &&
    (typeof value === "object" || typeof value === "function") &&
    typeof (value as Promise<T>).then === "function"
  );
};
