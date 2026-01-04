import type { QueryResult } from "@/lib/validations";

export type { QueryResult };

export interface ExpectedColumn {
  name: string;
  type?: string;
  nullable?: boolean;
}

export interface ExpectedConstraint {
  type: "PRIMARY KEY" | "FOREIGN KEY" | "UNIQUE" | "CHECK";
  columns: string[];
  definition?: string;
}

export interface ExpectedIndex {
  name?: string;
  columns: string[];
  isUnique?: boolean;
}

export interface SchemaInspectionConfig {
  table: string;
  shouldExist?: boolean;
  columns?: ExpectedColumn[];
  constraints?: ExpectedConstraint[];
  indexes?: ExpectedIndex[];
}

export interface TestQueryConfig {
  query: string;
  shouldSucceed: boolean;
  description?: string;
}

export interface DDLConditions {
  schemaInspection?: SchemaInspectionConfig;
  testQueries?: TestQueryConfig[];
  setupSQL?: string;
}

export interface DMLConditions {
  rows?: number;
  columns?: string[];
  values?: Record<string, unknown>[];
  customValidation?: (result: QueryResult) => boolean;
  [key: string]: unknown;
}

export interface ExpectedOutput {
  type: "exact" | "partial" | "count" | "custom" | "ddl_schema";
  conditions: DMLConditions | DDLConditions;
}

export type ExerciseType = "dml" | "ddl";
