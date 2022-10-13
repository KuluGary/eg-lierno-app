/**
 * Returns the initials of the string passed
 * @param {string} string
 * @returns {string}
 */
export function getInitials(string: string): string {
  if (!!string && typeof string === "string")
    return string.split(" ").reduce((acc, subname) => acc + subname[0] + "", "");

  return string;
}

/**
 * Returns the correct gendered name based on
 * the pronoun
 * @param {string} masculino
 * @param {string} femenino
 * @param {string} neutro
 * @param {string} pronombre
 * @returns {string}
 */
export function getGendered(masculino: string, femenino: string, neutro: string, pronombre: string): string {
  if (!masculino || !femenino || !neutro || !pronombre) return masculino;

  pronombre = pronombre.toLowerCase();

  switch (pronombre) {
    case "el":
      return masculino;
    case "la":
      return femenino;
    default:
      return neutro;
  }
}

/**
 * Returns a number with an operator prepended
 * @param {number} modifier value to convert to string
 * @returns {string}
 */
export function getOperatorString(modifier: number): string {
  return `${modifier >= 0 ? "+" : ""}${modifier}`;
}

/**
 * Returns the element of the object at the position
 * determined by string
 * @param {string} string the nested key string
 * @param {object} element the target object
 * @returns {any}
 */
export function getNestedKey(string: string, element: any): any {
  return string.split(".").reduce((previous, current) => (previous && previous[current]) || null, element);
}

/**
 * Sets a value to a position nested
 * within the object
 * @param {string} key the nested key string
 * @param {object} element the target object
 * @param {any} value the value to set
 * @returns {object}
 */
export function setNestedKey(key: string, element: any, value: any): object {
  key.split(".").reduce((previous, current, index) => {
    if (index === key.split(".").length - 1) {
      if (typeof previous[current] !== "object" || Array.isArray(previous[current])) {
        previous[current] = value;
      }
      return previous[current];
    } else {
      if (!previous[current] || typeof previous[current] !== "object") {
        previous[current] = {};
      }
      return previous[current];
    }
  }, element);

  return element;
}

/**
 * Debounces the callback by a determinated amount
 * @param {function} callback export function to debounce
 * @param {number} delay delay to debounce
 * @returns {function}
 */
export function debounce(callback: Function, delay: number): Function {
  let timer: number;

  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  };
}

/**
 * Checks if the string is a valid URL
 * @param {string} str string to check if is URL
 * @returns {boolean}
 */
export function isValidUrl(str: string): boolean {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator

  return !!pattern.test(str);
}

/**
 * Converts a string into an HSL color value
 * @param {string} string string to convert to HSL
 * @returns {string}
 */
export function stringToHsl(string: string): string {
  let hash = 0;

  if (!string || string.length === 0) {
    return `${hash}`;
  }

  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32bit integer
  }

  return "hsl(" + (hash % 360) + ",100%,65%)";
}

/**
 * Checks if an element is an array and, if it's not
 * converts it into array
 * @param {array | any} value element to cast as an array
 * @returns {array}
 */
export function castArray(value: any[] | any): Array<any> {
  return Array.isArray(value) ? value : [value];
}

/**
 * Returns if the element is an array
 * and if it is empty
 * @param {array} arr array to check
 * @returns {boolean}
 */
export function isArrayEmpty(arr: any[]): boolean {
  return Array.isArray(arr) && arr.length === 0;
}

/**
 * Returns if the element is an array
 * and if it is not empty
 * @param {array} arr array to check
 * @returns {boolean}
 */
export function isArrayNotEmpty(arr: any[]): boolean {
  return Array.isArray(arr) && arr.length > 0;
}

/**
 * Creates a new array from original
 * @param {array} arr original array
 * @returns {array} a clone of the original array
 */
export function cloneArray(arr: any[]): Array<any> {
  return Array.from(arr);
}

/**
 * Creates a fractional string based on decimal value
 * @param {number} value the decimal number to convert to fraction
 * @returns {string} the fraction based on decimal number
 */
export function getFraction(value: number): string {
  switch (value) {
    case 0:
      return "0";
    case 0.125:
      return "1/8";
    case 0.25:
      return "1/4";
    case 0.5:
      return "1/2";
    default:
      return value.toString();
  }
}
