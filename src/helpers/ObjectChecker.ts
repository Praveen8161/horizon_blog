const objChecker = function (obj: object): boolean {
  for (const i in obj) {
    if (!obj[i as keyof typeof obj]) {
      return false;
    }
  }

  return true;
};

export default objChecker;
