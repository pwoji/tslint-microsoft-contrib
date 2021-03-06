import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import {SyntaxKind} from './utils/SyntaxKind';
import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

/**
 * Implementation of the use-named-parameter rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'use-named-parameter',
        type: 'maintainability',
        description: 'Do not reference the arguments object by numerical index; instead, use a named parameter.',
        options: null,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Correctness',
        commonWeaknessEnumeration: '710'
    };

    public static FAILURE_STRING = 'Use a named parameter instead: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new UseNamedParameterWalker(sourceFile, this.getOptions()));
    }
}

class UseNamedParameterWalker extends ErrorTolerantWalker {
    protected visitElementAccessExpression(node: ts.ElementAccessExpression): void {
        if (node.argumentExpression != null) {
            if (node.argumentExpression.kind === SyntaxKind.current().NumericLiteral) {
                if (node.expression.getText() === 'arguments') {
                    const failureString = Rule.FAILURE_STRING + '\'' + node.getText() + '\'';
                    const failure = this.createFailure(node.getStart(), node.getWidth(), failureString);
                    this.addFailure(failure);
                }
            }
        }
        super.visitElementAccessExpression(node);
    }
}
