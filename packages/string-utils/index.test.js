const {
  getInitials,
  generiza,
  getOperatorString,
  getNestedKey,
  setNestedKey,
  isValidUrl,
  castArray,
  isArrayEmpty,
  isArrayNotEmpty,
  cloneArray,
} = require("./index");

describe("#getInitials", () => {
  test("returns the correct initials given a name", () => {
    expect(getInitials("Gary Cuétara")).toBe("GC");
    expect(getInitials("Eli Lage")).toBe("EL");
    expect(getInitials("Christian Fernández")).toBe("CF");
  });

  test("returns the same value if not given a name", () => {
    expect(getInitials(3)).toBe(3);
  });
});

describe("#generiza", () => {
  const pronouns = {
    masc: "El",
    fem: "La",
    neutral: "Le",
  };

  const args = {
    masc: "Guerrero",
    fem: "Guerrera",
    neutral: "Guerrere",
  };

  test("returns the masculine word with the masculine pronoun", () => {
    expect(generiza(...Object.values(args), pronouns.masc)).toBe(args.masc);
  });

  test("returns the femenine word with the femenine pronoun", () => {
    expect(generiza(...Object.values(args), pronouns.fem)).toBe(args.fem);
  });

  test("returns the neutral word with the neutral pronoun", () => {
    expect(generiza(...Object.values(args), pronouns.neutral)).toBe(args.neutral);
  });

  test("returns the neutral word with any other pronoun", () => {
    expect(generiza(...Object.values(args), "Xe")).toBe(args.neutral);
  });
});


describe("#getOperatorString", () => {
  test("it adds a + to a positive number", () => {
    expect(getOperatorString(5)).toBe("+5");
  });

  test("it adds a - to a negative number", () => {
    expect(getOperatorString(-5)).toBe("-5");
  });

  test("doesn't add operator to 0", () => {
    expect(getOperatorString(0)).toBe("0");
  });
});

describe("#getNestedKey", () => {
  test("it retrieves the correct value", () => {
    const key = "main.secondary.tertiary";
    const obj = { main: { secondary: { tertiary: "result" } } };

    expect(getNestedKey(key, obj)).toBe("result");
  });
});

describe("#setNestedKey", () => {
  test("it sets the correct value to the object by nested key", () => {
    const key = "main.secondary.tertiary";
    const value = "result";
    const obj = { main: { secondary: null } };
    const expectedObj = { main: { secondary: { tertiary: "result" } } };

    expect(setNestedKey(key, obj, value)).toEqual(expectedObj);
  });
});

describe("#isValidUrl", () => {
  test("it returns true if the URL is valid", () => {
    const url = "https://google.es";

    expect(isValidUrl(url)).toBe(true);
  });

  test("it returns false if the URL is not valid", () => {
    const string = "This is a test string";

    expect(isValidUrl(string)).toBe(false);
  });
});

describe("#castArray", () => {
  test("it returns an array when passed an array", () => {
    const array = [1, 2, 3];
    expect(castArray(array)).toEqual(array);
  });

  test("it returns an array when passed any value", () => {
    const value = 1;
    expect(castArray(value)).toEqual([value]);
  });
});

describe("#isArrayEmpty", () => {
  test("it returns true if the array is empty", () => {
    expect(isArrayEmpty([])).toBe(true);
  });

  test("it returns false if the array has values", () => {
    expect(isArrayEmpty([1, 2, 3])).toEqual(false);
  });

  test("it returns false if the value is not an array", () => {
    expect(isArrayEmpty(1)).toEqual(false);
  });
});

describe("#isArrayNotEmpty", () => {
  test("it returns true if the array is not empty", () => {
    expect(isArrayNotEmpty([1, 2, 3])).toBe(true);
  });

  test("it returns false if the array is empty", () => {
    expect(isArrayNotEmpty([])).toBe(false);
  });

  test("it returns false if the value is not an array", () => {
    expect(isArrayNotEmpty(1)).toBe(false);
  });
});

describe("#cloneArray", () => {
  test("it returns a cloned array", () => {
    const array = [1, 2, 3];

    expect(cloneArray(array)).toEqual(array);
    expect(cloneArray(array)).not.toBe(array);
  });
});
