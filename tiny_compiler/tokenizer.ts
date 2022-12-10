export enum TokenType {
  PARENTHESIS = "parenthesis",
  NUMBER = "number",
  STRING = "string",
  NAME = "name",
}
export type Token = {
  type: TokenType;
  value: string;
};

export function tokenizer(input: string) {
  let current = 0;

  let tokens: Token[] = [];

  while (current < input.length) {
    let char = input[current];

    if (char === "(") {
      tokens.push({
        type: TokenType.PARENTHESIS,
        value: "(",
      });

      current++;
      continue;
    }

    if (char === ")") {
      tokens.push({
        type: TokenType.PARENTHESIS,
        value: ")",
      });
      current++;
      continue;
    }

    // consume the whitespace
    const WHITESPACE = /\s/;
    if (WHITESPACE.test(char)) {
      current++;
      continue;
    }

    // match the numbers;
    const NUMBERS = /\d/;
    if (NUMBERS.test(char)) {
      let value = "";
      while (NUMBERS.test(char)) {
        value += char;
        current++;
        char = input[current];
      }

      tokens.push({ type: TokenType.NUMBER, value });
      continue;
    }

    // match the string;
    if (char === '"') {
      let value = "";
      // We'll skip the opening double quote in our token.
      char = input[++current];
      while (char !== '"') {
        value += char;
        char = input[++current];
      }

      // Skip the closing double quote.
      current++;

      tokens.push({ type: TokenType.STRING, value });
      continue;
    }

    let LETTERS = /[a-z]/i;
    if (LETTERS.test(char)) {
      let value = "";
      while (LETTERS.test(char)) {
        value += char;
        char = input[++current];
      }
      tokens.push({ type: TokenType.NAME, value });
      continue;
    }

    throw new TypeError("I dont know what this character is: " + char);
  }

  return tokens;
}
