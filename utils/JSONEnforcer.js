class JSONEnforcer {
  constructor(schema, options = { strict: false }) {
    this.schema = schema;
    this.strict = options.strict; // Enable strict validation
  }

  validate(input) {
    try {
      return { success: true, data: this.validateSchema(input, this.schema, "root") };
    } catch (error) {
      return { success: false, schema: this.schema, data: input, error: error.message };
    }
  }

  validateSchema(value, schema, path) {
    if (typeof schema === "string") {
      return this.validatePrimitive(value, schema, path);
    } else if (Array.isArray(schema)) {
      return this.validateArray(value, schema[0], path);
    } else if (typeof schema === "object") {
      return this.validateObject(value, schema, path);
    } else {
      throw new Error(`Invalid schema at ${path}`);
    }
  }

  validatePrimitive(value, type, path) {
    if (value === null || value === undefined) {
      return this.strict ? null : (type === "number" ? 0 : type === "boolean" ? false : "");
    }
    switch (type) {
      case "number":
        if (typeof value !== "number" && this.strict) throw new Error(`Expected number at ${path}, got ${typeof value}`);
        return typeof value === "number" ? value : parseFloat(value) || 0;
      case "string":
        return typeof value === "string" ? value : String(value);
      case "boolean":
        if (typeof value === "boolean") return value;
        if (this.strict) throw new Error(`Expected boolean at ${path}, got ${typeof value}`);
        return String(value).toLowerCase() === "true";
      default:
        throw new Error(`Unknown type "${type}" at ${path}`);
    }
  }

  validateArray(value, schema, path) {
    if (!Array.isArray(value)) return [];
    return value.map((item, index) =>
      typeof schema === "string"
        ? this.validatePrimitive(item, schema, `${path}[${index}]`)
        : this.validateSchema(item, schema, `${path}[${index}]`)
    );
  }

  validateObject(value, schema, path) {
    if (typeof value !== "object" || value === null) {
      throw new Error(`Validation error at ${path}: Expected an object but got ${typeof value}`);
    }
    const result = {};
    for (const key in schema) {
      const fieldSchema = schema[key];
      if (typeof fieldSchema === "object" && fieldSchema.optional && !(key in value)) {
        result[key] = fieldSchema.default ?? null;
      } else {
        result[key] = this.validateSchema(value[key] ?? null, fieldSchema.type || fieldSchema, `${path}.${key}`);
      }
    }
    return result;
  }
}

// Export for use
module.exports = JSONEnforcer;

