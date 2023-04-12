// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import { Rule } from "eslint";
import * as ESTree from "estree";

function getMissingSections(comments: ESTree.Comment[]): string[] {
  if (comments.some((comment) => comment.value.includes("DO NOT TRANSLATE"))) return [];

  return ["Scenario", "Use", "Purpose", "Max Length", "Read Out"].filter((section) => {
    // eslint-disable-next-line security/detect-non-literal-regexp
    const sectionRegex = new RegExp(`.*${section}( [0-9])?:.*`, "i");
    return !comments.some((comment) => sectionRegex.test(comment.value));
  });
}

/**
 * This rule enforces that any strings in translation files have context comments containing
 * "Scenario", "Use", "Purpose", "Max Length" and "Read out"
 */
export const contextComments: Rule.RuleModule = {
  create: (context: Rule.RuleContext) => {
    const sourceCode = context.getSourceCode();

    return {
      ExportDefaultDeclaration(exportDefaultNode): void {
        if (exportDefaultNode.declaration.type !== "ObjectExpression") return;

        exportDefaultNode.declaration.properties.forEach((namespace) => {
          if (namespace.type !== "Property") return;
          if (namespace.value.type !== "ObjectExpression") return;

          namespace.value.properties.forEach((translationKey) => {
            if (translationKey.type !== "Property") return;

            const missingSections = getMissingSections(
              sourceCode.getCommentsBefore(translationKey)
            );

            if (missingSections.length) {
              context.report({
                node: translationKey,
                message: `Context comment is missing sections - ${missingSections.join(", ")}`,
              });
            }
          });
        });
      },
    };
  },
};
