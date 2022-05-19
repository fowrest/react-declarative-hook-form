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

const bob = {
  name: 'Bob',
  measurements: {
    height: 1.1,
    weight: 35,
  },
  friends: ['Alice', 'Trudy'],
};

const p = {
  name: 'Foo',
  lastName: 'Bar',
  kids: {
    favorite: 'Susan',
    data: [bob],
  },
  phoneNumbers: ['123', '321'],
};

// TODO: test schemas, to be removed
const child: Schema = {
  name: {
    type: 'text',
  },
  measurement: {
    type: SpecialType.Meta,
    children: {
      height: {
        type: 'number',
      },
      weight: {
        type: 'number',
      },
    },
  },
  /* friends: [{ type: "string" }], */
};

const faa = {
  name: 'foo',
  lastName: 'bar',
  kids: {
    favorite: 'Lars',
    data: [
      {
        name: 'as',
        measurement: {
          height: 1,
          weight: 2,
        },
      },
    ],
    /* friends: ["gggg"], */
  },
};

const parent: Schema = {
  name: {
    id: 'a',
    type: 'text',
  },
  lastName: {
    type: 'text',
  },
  kids: {
    type: SpecialType.Meta,
    children: {
      favorite: {
        type: 'string',
      },
      data: [child],
    },
  },
  /*   phoneNumbers: [
    {
      type: "string",
    },
  ], */
};
