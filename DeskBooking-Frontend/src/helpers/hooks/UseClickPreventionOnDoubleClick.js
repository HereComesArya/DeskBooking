import React from "react";
import useCancellablePromises from "./UseCancellablePromises";

import cancellablePromise, { delay } from "../utils/promise-utils";

const useClickPreventionOnDoubleClick = (onClick, onDoubleClick) => {
  const api = useCancellablePromises();

  const handleClick = (e) => {
    api.clearPendingPromises();
    const waitForClick = cancellablePromise(delay(200));
    api.appendPendingPromise(waitForClick);

    return waitForClick.promise
      .then(() => {
        api.removePendingPromise(waitForClick);
        onClick(e);
      })
      .catch((errorInfo) => {
        // console.log(waitForClick);
        api.removePendingPromise(waitForClick);
        if (!errorInfo.isCanceled) {
          throw errorInfo.error;
        }
      });
  };

  const handleDoubleClick = () => {
    api.clearPendingPromises();
    onDoubleClick();
  };

  return [handleClick, handleDoubleClick];
};

export default useClickPreventionOnDoubleClick;
