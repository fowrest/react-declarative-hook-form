import { HTMLInputTypeAttribute } from 'react';
import { RegisterOptions } from 'react-hook-form';

export type Schema = Record<string, SchemaInput>;

export type SchemaInput = Input | { [x: string]: SchemaInput } | [Schema];

export interface Input {
  id?: string;
  type: HTMLInputTypeAttribute;
  alt?: string;
  registerOptions?: RegisterOptions;
}
