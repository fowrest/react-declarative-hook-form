import React, { FC, HTMLInputTypeAttribute } from 'react';
import { Control, useFieldArray, UseFormRegister } from 'react-hook-form';
import { InputRepository } from './inputRepository/InputRepository';
import { Schema, Input, SchemaInput } from './Schema';

interface SchemaArrayHandlerProps {
  register: UseFormRegister<Record<string, any>>;
  control: Control<Record<string, any>, any>;
  stringPath: string;
  schema: Schema;
}

const getIdentityValue = (type: HTMLInputTypeAttribute) => {
  switch (type) {
    case 'number':
      return 0;
    default:
      return '';
  }
};

const isInput = (inputOrSchema: Input | Schema): inputOrSchema is Input => {
  return typeof inputOrSchema.type === 'string';
};

const getObjectStructure = (schema: Schema) => {
  const structure: Record<string, any> = {};
  Object.keys(schema).forEach((schemaKey) => {
    const data = schema[schemaKey];

    const isArray = Array.isArray(data);
    if (isArray) {
      structure[schemaKey] = [getObjectStructure(data[0])];
    } else {
      if (isInput(data)) {
        structure[schemaKey] = getIdentityValue(data.type);
      } else {
        structure[schemaKey] = getObjectStructure(data);
      }
    }
  });

  return structure;
};

const SchemaArrayHandler: FC<SchemaArrayHandlerProps> = ({ register, control, stringPath, schema }) => {
  const { fields, append } = useFieldArray({
    control,
    name: stringPath,
  });

  const Button = InputRepository.getRepository().get('button');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        padding: 5,
        marginLeft: 20,
        border: '1px solid black',
      }}
    >
      {fields.map((_, index: number) => handleSchema(schema, register, control, `${stringPath}.${index}`))}

      <Button style={{ alignSelf: 'end' }} onClick={() => append(getObjectStructure(schema))}>
        +
      </Button>
    </div>
  );
};

function handleInput(input: Input, register: UseFormRegister<Record<string, any>>, stringPath: string) {
  const repository = InputRepository.getRepository();

  const Component = repository.get(input.type);
  return (
    <Component
      {...register(stringPath, input.registerOptions)}
      placeholder={stringPath.substring(stringPath.lastIndexOf('.') + 1).toLowerCase()}
      key={stringPath}
      style={{ margin: 2 }}
    />
  );
}

function handleSchemaInput(
  schemaInput: SchemaInput,
  register: UseFormRegister<Record<string, any>>,
  control: Control<Record<string, any>, any>,
  stringPath: string
): JSX.Element[] {
  if (Array.isArray(schemaInput)) {
    const [schema] = schemaInput;

    return [
      <SchemaArrayHandler
        key={stringPath}
        register={register}
        control={control}
        stringPath={stringPath}
        schema={schema}
      />,
    ];
  } else {
    if (!isInput(schemaInput)) {
      return Object.entries(schemaInput).flatMap(([childKey, child]) => {
        if (Array.isArray(child)) {
          const [schema] = child;

          return [
            <SchemaArrayHandler
              key={`${stringPath}.${childKey}`}
              register={register}
              control={control}
              stringPath={`${stringPath}.${childKey}`}
              schema={schema}
            />,
          ];
        }

        return handleSchemaInput(child, register, control, `${stringPath}.${childKey}`);
      });
    } else {
      return [handleInput(schemaInput, register, stringPath)];
    }
  }
}

function handleSchema(
  schema: Schema,
  register: UseFormRegister<Record<string, any>>,
  control: Control<Record<string, any>, any>,
  stringPath: string
) {
  return Object.entries(schema).flatMap(([schemaKey, schemaInput]) => {
    return handleSchemaInput(schemaInput, register, control, stringPath ? `${stringPath}.${schemaKey}` : schemaKey);
  });
}

export default function buildForm(
  schema: Schema,
  register: UseFormRegister<Record<string, any>>,
  control: Control<Record<string, any>, any>
) {
  return <div>{handleSchema(schema, register, control, '')}</div>;
}
