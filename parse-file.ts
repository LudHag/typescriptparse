import { parse } from "@typescript-eslint/typescript-estree";
import {
  ProgramStatement,
  TypeElement,
  TypeNode,
  TSTypeAliasDeclaration,
  TSInterfaceDeclaration,
  Literal,
  Identifier,
} from "@typescript-eslint/types/dist/generated/ast-spec";
import fs from "fs";

export const parseFile = (path: string) => {
  const code = fs.readFileSync(path, "utf8");

  const ast = parse(code);

  const parsedTypes = ast.body.map(parseProgramStatement);

  return parsedTypes;
};

const parseProgramStatement = (statement: ProgramStatement) => {
  if (statement.type === "ExportNamedDeclaration") {
    if (statement.declaration.type === "TSTypeAliasDeclaration") {
      return parseType(statement.declaration);
    }

    if (statement.declaration.type === "TSInterfaceDeclaration") {
      return parseInterface(statement.declaration);
    }
  }

  return {};
};

const parseType = (declaration: TSTypeAliasDeclaration) => {
  let props = [];
  let type = "type";
  if (declaration.typeAnnotation.type === "TSTypeLiteral") {
    const propsMembers = declaration.typeAnnotation.members;

    props = propsMembers.map(parseProp);
  } else {
    type = mapType(declaration.typeAnnotation);
  }

  return {
    name: declaration.id.name,
    props,
    type,
  };
};

const parseInterface = (declaration: TSInterfaceDeclaration) => {
  let props = [];
  let type = "interface";
  // if (declaration.typeAnnotation.type === "TSTypeLiteral") {
  //   const propsMembers = declaration.typeAnnotation.members;

  //   props = propsMembers.map(parseProp);
  // } else {
  //   type = mapType(declaration.typeAnnotation);
  // }

  return {
    name: declaration.id.name,
    props,
    type,
  };
};

const parseProp = (prop: TypeElement) => {
  if (prop.type === "TSPropertySignature" && prop.key.type === "Identifier") {
    const type = mapType(prop.typeAnnotation.typeAnnotation);

    return {
      name: prop.key.name,
      type,
      optional: prop.optional,
    };
  }
  return {};
};

const mapType = (type: TypeNode) => {
  switch (type.type) {
    case "TSStringKeyword":
      return "string";
    case "TSNumberKeyword":
      return "number";
    case "TSBooleanKeyword":
      return "boolean";
    case "TSNullKeyword":
      return "null";
    case "TSArrayType":
      return `${mapType(type.elementType)}[]`;
    case "TSUnionType":
      return type.types.map((t) => mapType(t)).join(" | ");
    case "TSLiteralType":
      return (type.literal as Literal).raw;
    case "TSTypeReference":
      return (type.typeName as Identifier).name;
    default:
      return null;
  }
};
