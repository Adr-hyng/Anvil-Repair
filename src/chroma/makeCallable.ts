export default function makeCallable<T extends object>(
  object: T,
  callback: (...args: any[]) => void
): T {
  const callableObject = callback.bind(object) as T;

  Object.setPrototypeOf(callableObject, Object.getPrototypeOf(object));

  const properties = Object.getOwnPropertyDescriptors(object);
  Object.defineProperties(callableObject, properties);

  return callableObject;
}
