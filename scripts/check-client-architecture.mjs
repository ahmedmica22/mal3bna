import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = fileURLToPath(new URL('../', import.meta.url));
const files = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? files(file) : /\.tsx?$/.test(file) ? [file] : [];
  });
const failures = [];
let checked = 0;
for (const app of ['web', 'mobile']) {
  for (const file of files(path.join(root, 'apps', app, 'src'))) {
    if (/[/\\]tests[/\\]|\.test\./.test(file)) continue;
    const relative = path.relative(root, file).replaceAll('\\', '/');
    const text = fs.readFileSync(file, 'utf8');
    const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const presentation = /\/features\/.*\/(components|views)\//.test(relative);
    const route = app === 'web' && relative.includes('/pages/');
    for (const statement of source.statements.filter(ts.isImportDeclaration)) {
      const target = statement.moduleSpecifier.text;
      if (
        (presentation || route) &&
        (/services\//.test(target) || /@tanstack\/react-query/.test(target))
      )
        failures.push(`${relative}: presentation imports data access ${target}`);
      if (target.includes('apps/api') || target.includes('@prisma'))
        failures.push(`${relative}: client imports backend implementation`);
    }
    if (presentation || route) {
      const inspect = (node) => {
        if (
          ts.isCallExpression(node) &&
          ts.isIdentifier(node.expression) &&
          node.expression.text === 'fetch'
        )
          failures.push(`${relative}: presentation performs a network request`);
        ts.forEachChild(node, inspect);
      };
      inspect(source);
    }
    if (route && text.split('\n').length > 110)
      failures.push(`${relative}: route composition exceeds 110 lines`);
    if (/\/features\/.*\/hooks\//.test(relative)) {
      const inspect = (node) => {
        if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node) || ts.isJsxFragment(node))
          failures.push(`${relative}: controller hook contains JSX`);
        else ts.forEachChild(node, inspect);
      };
      inspect(source);
    }
    checked++;
  }
}
if (failures.length) {
  console.error([...new Set(failures)].join('\n'));
  process.exitCode = 1;
} else
  console.log(
    `Client architecture passed: ${checked} source files; thin routes, data access boundaries, and JSX-free controllers.`,
  );
