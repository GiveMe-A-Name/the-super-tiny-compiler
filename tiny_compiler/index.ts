import { codeGenerator } from "./codeGenerator";
import { parser } from "./parser";
import { tokenizer } from "./tokenizer";
import { transformer } from "./transformer";

export function compiler(input: string) {
  const tokens = tokenizer(input);
  const ast = parser(tokens);
  const newAst = transformer(ast);
  let output = codeGenerator(newAst);

  return output;
}
