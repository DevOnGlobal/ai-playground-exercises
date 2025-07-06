// Common TypeScript patterns for working with data.

// Use interfaces to define the shape of your data.
export interface MyData {
  id: number;
  name: string;
}

// Use enums to represent a fixed set of values.
export enum MyEnum {
  Value1 = 'VALUE1',
  Value2 = 'VALUE2',
}

// Use classes to encapsulate data and behavior.
export class MyClass {
  private data: MyData;

  constructor(data: MyData) {
    this.data = data;
  }

  public doSomething(): void {
    console.log(this.data.name);
  }
}

// Use async/await to work with promises.
export async function myAsyncFunction(): Promise<MyData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: 1, name: 'My Data' });
    }, 1000);
  });
}
