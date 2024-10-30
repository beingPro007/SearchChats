const asyncHandler = (requestHanler) => {
  return (req, res, next) => {
    Promise.resolve(requestHanler(req, res, next)).catch((err) => next.err);
  };
};

export { asyncHandler };
