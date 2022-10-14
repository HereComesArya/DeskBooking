import { cancellablePromise } from "./cancellable-promise";

export const delay = (n) => new Promise((resolve) => setTimeout(resolve, n));

export default cancellablePromise;
