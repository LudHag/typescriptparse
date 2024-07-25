// import { parseSchema } from "./parse-schema";

import { parseFile } from "./parse-file";

// parseSchema("./testschema.yaml");

const res = parseFile("./testmodels/product.ts");

console.dir(res, { depth: null });
