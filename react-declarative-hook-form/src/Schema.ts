import { HTMLInputTypeAttribute } from 'react';
import { RegisterOptions } from 'react-hook-form';

export type Schema = Record<string, SchemaInput>;

export type SchemaInput = Input | MetaInput | [Schema];

export enum SpecialType {
  Meta,
}

export interface Input {
  id?: string;
  type: HTMLInputTypeAttribute;
  alt?: string;
  registerOptions?: RegisterOptions;
}

export interface MetaInput {
  type: SpecialType.Meta;
  children: Schema;
}
