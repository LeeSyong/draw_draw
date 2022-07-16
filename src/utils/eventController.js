const eventController = (() => {
  let timeout;

  const debounce = (callback, ms) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      callback();
    }, ms);
  };

  return Object.freeze({ debounce });
})();

export default eventController;
