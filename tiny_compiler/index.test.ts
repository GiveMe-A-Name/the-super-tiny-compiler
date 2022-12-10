import { compiler } from ".";
import { parser } from "./parser";
import { tokenizer, Token, TokenType } from "./tokenizer";
import { transformer } from "./transformer";
const assert = require("assert");

const input = "(add 2 (subtract 4 2))";
const tokens: Token[] = [
  { type: TokenType.PARENTHESIS, value: "(" },
  { type: TokenType.NAME, value: "add" },
  { type: TokenType.NUMBER, value: "2" },
  { type: TokenType.PARENTHESIS, value: "(" },
  { type: TokenType.NAME, value: "subtract" },
  { type: TokenType.NUMBER, value: "4" },
  { type: TokenType.NUMBER, value: "2" },
  { type: TokenType.PARENTHESIS, value: ")" },
  { type: TokenType.PARENTHESIS, value: ")" },
];
assert.deepStrictEqual(
  tokenizer(input),
  tokens,
  "Tokenizer should turn `input` string into `tokens` array"
);

const ast = {
  type: "Program",
  body: [
    {
      type: "CallExpression",
      name: "add",
      params: [
        {
          type: "NumberLiteral",
          value: "2",
        },
        {
          type: "CallExpression",
          name: "subtract",
          params: [
            {
              type: "NumberLiteral",
              value: "4",
            },
            {
              type: "NumberLiteral",
              value: "2",
            },
          ],
        },
      ],
    },
  ],
};

assert.deepStrictEqual(
  parser(tokens),
  ast,
  "Parser should turn `tokens` array into `ast`"
);

const newAst = {
  type: "Program",
  body: [
    {
      type: "ExpressionStatement",
      expression: {
        type: "CallExpression",
        callee: {
          type: "Identifier",
          name: "add",
        },
        arguments: [
          {
            type: "NumberLiteral",
            value: "2",
          },
          {
            type: "CallExpression",
            callee: {
              type: "Identifier",
              name: "subtract",
            },
            arguments: [
              {
                type: "NumberLiteral",
                value: "4",
              },
              {
                type: "NumberLiteral",
                value: "2",
              },
            ],
          },
        ],
      },
    },
  ],
};

assert.deepStrictEqual(
  transformer(ast as any),
  newAst,
  "Transformer should turn `ast` into a `newAst`"
);

const output = `add("2", subtract("4", "2"));`;
assert.deepStrictEqual(
  compiler(input),
  output,
  "Compiler should turn `input` into `output`"
);
