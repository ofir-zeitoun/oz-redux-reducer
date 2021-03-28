import { Constructor } from "./utils";
export declare function ozReducer<T extends Constructor>(constructor: T): {
    new (...args: any[]): {};
} & T;
export declare function action(target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor): PropertyDescriptor;
export declare function initial(target: any, propertyKey: string): void;
