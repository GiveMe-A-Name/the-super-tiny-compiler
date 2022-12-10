import { NodeType, Root } from "./parser";
import { traverser } from "./traverser";

type Temp = {
  _context: any[];
};

export function transformer(ast: Root) {
  let newAst = {
    type: "Program",
    body: [],
  };

  (ast as unknown as Temp)._context = newAst.body;

  traverser(ast, {
    NumberLiteral: {
      enter(node, parent) {
        (parent as unknown as Temp)._context.push({
          type: "NumberLiteral",
          value: (node as any).value,
        });
      },
    },
    StringLiteral: {
      enter(node, parent) {
        (parent as unknown as Temp)._context.push({
          type: "StringLiteral",
          value: (node as any).value,
        });
      },
    },
    CallExpression: {
      enter(node, parent) {
        let expression = {
          type: "CallExpression",
          callee: {
            type: "Identifier",
            name: (node as { name: string }).name,
          },
          arguments: [],
        };

        (node as unknown as Temp)._context = expression.arguments;

        if (parent?.type !== NodeType.CALL_EXPRESSION) {
          (expression as any) = {
            type: "ExpressionStatement",
            expression,
          };
        }
        (parent as unknown as Temp)._context.push(expression);
      },
    },
  });

  return newAst;
}
