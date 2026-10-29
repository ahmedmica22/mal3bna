import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
const root=fileURLToPath(new URL('../',import.meta.url));
const document=JSON.parse(fs.readFileSync(path.join(root,'apps/api/openapi/openapi.json'),'utf8'));
const normalize=(value)=>value.split('?')[0].replace(/\{[^}]*\}/g,'{}');
const routes=new Set(Object.entries(document.paths).flatMap(([route,operations])=>Object.keys(operations).map(method=>method.toUpperCase()+' '+normalize(route))));
const walk=(dir)=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):/\.tsx?$/.test(entry.name)?[path.join(dir,entry.name)]:[]);
function routeText(node){if(ts.isStringLiteralLike(node))return node.text;if(ts.isTemplateExpression(node))return node.head.text+node.templateSpans.map(span=>(ts.isConditionalExpression(span.expression)&&routeText(span.expression.whenTrue)?.startsWith('?')&&routeText(span.expression.whenFalse)===''?'?{}':'{}')+span.literal.text).join('');if(ts.isBinaryExpression(node)&&node.operatorToken.kind===ts.SyntaxKind.PlusToken)return (routeText(node.left)??'{}')+(routeText(node.right)??'{}');return null;}
const entries=[];const failures=[];
for(const file of walk(path.join(root,'apps/mobile/src'))){
 const source=ts.createSourceFile(file,fs.readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 function inspect(node){
  if(ts.isCallExpression(node)&&(ts.isIdentifier(node.expression)&&node.expression.text==='request'||ts.isPropertyAccessExpression(node.expression)&&node.expression.name.text==='request')){
   const route=node.arguments[0]&&routeText(node.arguments[0]);
   if(route?.startsWith('/')){
    let method='GET';const init=node.arguments[1];
    if(init&&ts.isObjectLiteralExpression(init))for(const property of init.properties)if(ts.isPropertyAssignment(property)&&property.name.getText(source).replace(/['"]/g,'')==='method'&&ts.isStringLiteralLike(property.initializer))method=property.initializer.text.toUpperCase();
    const key=method+' '+normalize(route);entries.push({method,path:route.split('?')[0],source:path.relative(root,file).replaceAll('\\','/')});
    if(!routes.has(key))failures.push(`${path.relative(root,file)}: ${key} is absent from OpenAPI`);
   }
  }
  ts.forEachChild(node,inspect);
 }
 inspect(source);
}
if(failures.length){console.error([...new Set(failures)].join('\n'));process.exitCode=1;}else console.log(`Mobile API contract passed: ${entries.length} static call sites, ${new Set(entries.map(row=>row.method+' '+normalize(row.path))).size} unique operations; all declared in OpenAPI.`);
