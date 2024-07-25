import SwaggerParser from "@apidevtools/swagger-parser";

export const parseSchema = async (schema: string) => {
  let api = await SwaggerParser.validate(schema);

  console.log(api);
};
