import fs from "fs";
import path from "path";

const name = process.argv[2];

if (!name) {
  console.log("Please provide module name");
  process.exit(1);
}

const base = `src/modules/${name}`;
fs.mkdirSync(base, { recursive: true });

const files = {
  [`${name}.controller.ts`]: `export const ${name} = () => {};`,
  [`${name}.service.ts`]: `export const ${name}Service = () => {};`,
  [`${name}.routes.ts`]: `import { Router } from "express";
const router = Router();
export default router;`,
  [`${name}.validation.ts`]: `export const ${name}Schema = {};`,
};

for (const file in files) {
  fs.writeFileSync(path.join(base, file), files[file]);
}

console.log(`${name} module created`);
