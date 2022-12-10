import { Token, TokenType } from "./tokenizer";

export enum NodeType {
  NUMBER_LITERAL = "NumberLiteral",
  STRING_LITERAL = "StringLiteral",
  CALL_EXPRESSION = "CallExpression",
  PROGRAM = "Program",
}

export type Root = {
  type: NodeType.PROGRAM;
  body: Node[];
};

export type Node =
  | {
      type: NodeType.NUMBER_LITERAL | NodeType.STRING_LITERAL;
      value: string;
    }
  | {
      type: NodeType.CALL_EXPRESSION;
      name: string;
      params: Node[];
    };

export function parser(tokens: Token[]) {
  let current = 0;

  let ast: Root = {
    type: NodeType.PROGRAM,
    body: [],
  };

  while (current < tokens.length) {
    ast.body.push(walk());
  }

  return ast;

  function walk(): Node {
    let token: Token = tokens[current];
    if (token.type === TokenType.NUMBER) {
      current++;
      return {
        type: NodeType.NUMBER_LITERAL,
        value: token.value,
      };
    }

    if (token.type === TokenType.STRING) {
      current++;
      return {
        type: NodeType.STRING_LITERAL,
        value: token.value,
      };
    }

    // "(add 2 (subtract 4 2))"
    if (token.type === TokenType.PARENTHESIS && token.value === "(") {
      token = tokens[++current];
      let node: Node = {
        type: NodeType.CALL_EXPRESSION,
        name: token.value,
        params: [],
      };
      token = tokens[++current];

      while (!(token.type === TokenType.PARENTHESIS && token.value === ")")) {
        node.params.push(walk());
        token = tokens[current];
      }
      current++;

      return node;
    }

    throw new TypeError(JSON.stringify(token, null, 2));
  }
}
