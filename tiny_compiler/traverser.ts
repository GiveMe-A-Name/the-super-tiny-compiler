import { Node, Root, NodeType } from "./parser";

type VisitorLiteral =
  | NodeType.CALL_EXPRESSION
  | NodeType.STRING_LITERAL
  | NodeType.PROGRAM
  | NodeType.NUMBER_LITERAL;

type Visitor = {
  [key in VisitorLiteral]?: {
    enter?: (node: Root | Node, parent: Root | Node | null) => void;
    exit?: (node: Root | Node, parent: Root | Node | null) => void;
  };
};

export function traverser(ast: Root, visitor: Visitor) {
  traverseNode(ast, null);

  function traverseArray(array: Node[], parent: any) {
    array.forEach((child) => {
      traverseNode(child, parent);
    });
  }
  function traverseNode(node: Root | Node, parent: any) {
    let methods = visitor[node.type];

    if (methods && methods.enter) {
      methods.enter(node, parent);
    }

    switch (node.type) {
      case NodeType.PROGRAM:
        traverseArray(node.body, node);
        break;
      case NodeType.CALL_EXPRESSION:
        traverseArray(node.params, node);
        break;
      case NodeType.NUMBER_LITERAL:
      case NodeType.STRING_LITERAL:
        break;
      default:
        throw new TypeError(JSON.stringify(node, null, 2));
    }

    if (methods && methods.exit) {
      methods.exit(node, parent);
    }
  }
}
