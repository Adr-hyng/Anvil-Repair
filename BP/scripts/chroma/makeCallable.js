export default function makeCallable(object, callback) {
    const callableObject = callback.bind(object);
    Object.setPrototypeOf(callableObject, Object.getPrototypeOf(object));
    const properties = Object.getOwnPropertyDescriptors(object);
    Object.defineProperties(callableObject, properties);
    return callableObject;
}
