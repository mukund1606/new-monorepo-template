// /* eslint-disable @typescript-eslint/no-unsafe-argument */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import type { Module } from "@evyweb/ioctopus";

// import type { DI_RETURN_TYPES } from "~/di/types";
// import { DI_SYMBOLS } from "~/di/types";

// // Helper type to extract constructor parameters

// type ConstructorParameters<T> = T extends new (...args: infer P) => any ? P : never;

// // Helper type to find the DI symbol key for a given type
// type FindDISymbolKey<T> = {
//   [K in keyof DI_RETURN_TYPES]: DI_RETURN_TYPES[K] extends T ? K : never;
// }[keyof DI_RETURN_TYPES];

// // Helper type to map constructor parameters to their corresponding DI symbol keys
// export type ConstructorParamsToDIKeys<T extends new (...args: Array<any>) => any> = {
//   [K in keyof ConstructorParameters<T>]: FindDISymbolKey<ConstructorParameters<T>[K]>;
// };

// // Helper type to extract function parameters

// type FunctionParameters<T> = T extends (...args: infer P) => any ? P : never;

// // Type to ensure dependencies match constructor parameters exactly
// type MatchConstructorParams<
//   TClass extends new (...args: Array<any>) => any,
//   TDeps extends ReadonlyArray<keyof typeof DI_SYMBOLS>,
// > =
//   ConstructorParameters<TClass> extends {
//     [K in keyof TDeps]: DI_RETURN_TYPES[TDeps[K] & keyof DI_RETURN_TYPES];
//   }
//     ? TDeps
//     : never;

// /**
//  * Type-safe wrapper for binding classes to the IoC container.
//  * This ensures that the dependency array matches the class constructor signature.
//  *
//  * @param module - The IoC module to bind to
//  * @param symbol - The symbol key to bind
//  * @param classConstructor - The class to instantiate
//  * @param dependencies - Array of DI symbol keys that match the constructor parameters in order and type
//  *
//  * @example
//  * ```ts
//  * // This will give a type error if dependencies don't match constructor
//  * bindClass(
//  *   module,
//  *   "ITodosRepository",
//  *   TodosRepository,
//  *   ["IInstrumentationService", "ICrashReporterService"] // Must match constructor signature
//  * );
//  * ```
//  */
// export function bindClass<
//   TSymbolKey extends keyof typeof DI_SYMBOLS,
//   TClass extends new (...args: Array<any>) => DI_RETURN_TYPES[TSymbolKey],
//   TDeps extends ReadonlyArray<keyof typeof DI_SYMBOLS>,
// >(
//   module: Module,
//   symbol: TSymbolKey,
//   classConstructor: TClass,
//   dependencies?: MatchConstructorParams<TClass, TDeps>,
// ): void {
//   const binding = module.bind(DI_SYMBOLS[symbol]);

//   if (dependencies && dependencies.length > 0) {
//     binding.toClass(
//       classConstructor as any,
//       dependencies.map((dep) => DI_SYMBOLS[dep]),
//     );
//   } else {
//     binding.toClass(classConstructor as any);
//   }
// }

// // Type to ensure dependencies match function parameters exactly
// type MatchFunctionParams<
//   TFunc extends (...args: Array<any>) => any,
//   TDeps extends ReadonlyArray<keyof typeof DI_SYMBOLS>,
// > =
//   FunctionParameters<TFunc> extends {
//     [K in keyof TDeps]: DI_RETURN_TYPES[TDeps[K] & keyof DI_RETURN_TYPES];
//   }
//     ? TDeps
//     : never;

// /**
//  * Type-safe wrapper for binding higher-order functions to the IoC container.
//  * This ensures that the dependency array matches the function signature.
//  *
//  * @param module - The IoC module to bind to
//  * @param symbol - The symbol key to bind
//  * @param higherOrderFunction - The higher-order function that takes dependencies and returns a function
//  * @param dependencies - Array of DI symbol keys that match the function parameters in order and type
//  *
//  * @example
//  * ```ts
//  * // This will give a type error if dependencies don't match function signature
//  * bindHigherOrderFunction(
//  *   module,
//  *   "ICreateTodoUseCase",
//  *   createTodoUseCase,
//  *   ["IInstrumentationService", "ITodosRepository"] // Must match function signature
//  * );
//  * ```
//  */
// export function bindHigherOrderFunction<
//   TSymbolKey extends keyof typeof DI_SYMBOLS,
//   TFunc extends (...args: Array<any>) => DI_RETURN_TYPES[TSymbolKey],
//   TDeps extends ReadonlyArray<keyof typeof DI_SYMBOLS>,
// >(
//   module: Module,
//   symbol: TSymbolKey,
//   higherOrderFunction: TFunc,
//   dependencies?: MatchFunctionParams<TFunc, TDeps>,
// ): void {
//   const binding = module.bind(DI_SYMBOLS[symbol]);

//   if (dependencies && dependencies.length > 0) {
//     binding.toHigherOrderFunction(
//       higherOrderFunction as any,
//       dependencies.map((dep) => DI_SYMBOLS[dep]),
//     );
//   } else {
//     binding.toHigherOrderFunction(higherOrderFunction as any);
//   }
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DI_RETURN_TYPES } from "~/di/types";

type FindDISymbolKey<T> = {
  [K in keyof DI_RETURN_TYPES]: DI_RETURN_TYPES[K] extends T
    ? T extends DI_RETURN_TYPES[K]
      ? K
      : never
    : never;
}[keyof DI_RETURN_TYPES];

// A recursive helper type to map each element of a tuple
type MapTupleToDIKeys<T extends Array<any>> =
  // Is the tuple empty? If so, return an empty tuple.
  T extends []
    ? []
    : // Does the tuple have a first element and a "rest"?
      T extends [infer Head, ...infer Tail]
      ? // If yes, find the key for the Head and recursively call this type on the Tail.
        [FindDISymbolKey<Head>, ...MapTupleToDIKeys<Tail>]
      : // Fallback for regular arrays (less common for constructors)
        Array<FindDISymbolKey<T[number]>>;

// The main utility type now uses the recursive helper.
export type ConstructorParamsToDIKeys<T extends new (...args: Array<any>) => any> =
  MapTupleToDIKeys<ConstructorParameters<T>>;

export type FunctionParamsToDIKeys<T extends (...args: Array<any>) => any> =
  MapTupleToDIKeys<Parameters<T>>;
