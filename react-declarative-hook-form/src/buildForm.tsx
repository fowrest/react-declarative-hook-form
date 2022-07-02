import React, { FC, HTMLInputTypeAttribute, useCallback, useMemo, useState } from 'react';
import { Control, useFieldArray, UseFormRegister } from 'react-hook-form';
import { InputRepository } from './inputRepository/InputRepository';
import { Schema, Input, SchemaInput } from './Schema';
import Close from './icons/Close';
import Add from './icons/Add';
import DragHandle from './icons/DragHandle';

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

const getTargetIdFromElements = (elements: Element[], idPattern: RegExp) => {
  for (const elem of elements) {
    if (idPattern.test(elem.id)) {
      console.log('Match on id', elem.id);
      return elem;
    }
  }
};

const SchemaArrayHandler: FC<SchemaArrayHandlerProps> = ({ register, control, stringPath, schema }) => {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: stringPath,
  });

  const [draggingIndex, setDraggingIndex] = useState<number | undefined>();

  const onMoveEnd = useCallback(
    (targetId: string | number) => {
      if (draggingIndex !== undefined) {
        let targetIndex = targetId;

        if (typeof targetIndex !== 'number') {
          let toBeIndex = targetIndex;
          const pathIndexEnd = stringPath.length + 1;
          toBeIndex = toBeIndex.substring(pathIndexEnd);

          const indexEndIndex = toBeIndex.indexOf('-');
          toBeIndex = toBeIndex.substring(0, indexEndIndex);

          targetIndex = Number.parseInt(toBeIndex);
          if (Number.isNaN(targetIndex)) {
            return;
          }
        }

        move(draggingIndex, targetIndex);
        setDraggingIndex(targetIndex);
      }
    },
    [draggingIndex, setDraggingIndex]
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        margin: 2,
        backgroundColor: 'rgba(0,0,0, 0.03)',
        border: '1px solid black',
        flex: '1 0 calc(100% - 20px)',
        boxSizing: 'border-box',
      }}
    >
      {fields.map((_, index: number) => (
        <div
          id={`${stringPath}-${index}-target`}
          style={{
            display: 'flex',
            borderBottom: index !== fields.length - 1 ? '1px solid black' : 'none',
            ...(draggingIndex === index ? { opacity: 0.5 } : {}),
          }}
          // This is triggered on the drop target
          onDragOver={(e) => {
            e.preventDefault();
            onMoveEnd(index);
          }}
        >
          <div
            id={`${stringPath}-${index}-handle`}
            style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}
            draggable={true}
            onDragStart={() => setDraggingIndex(index)}
            onDragEnd={() => setDraggingIndex(undefined)}
            onTouchMove={(e) => {
              const elements = document.elementsFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
              const elem = getTargetIdFromElements(elements, new RegExp(`^${stringPath}-[0-9]+-target$`));
              const id = elem?.id;
              if (id !== undefined) {
                onMoveEnd(id);
              }
            }}
            onTouchStart={() => setDraggingIndex(index)}
            onTouchEnd={() => setDraggingIndex(undefined)}
          >
            <DragHandle />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', margin: 2 }}>
            {handleSchema(schema, register, control, `${stringPath}.${index}`)}
          </div>
          <div
            id={`${stringPath}-${index}-close`}
            style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}
            onClick={() => remove(index)}
          >
            <Close />
          </div>
        </div>
      ))}

      <div id={`${stringPath}-add`} style={{ alignSelf: 'end' }} onClick={() => append(getObjectStructure(schema))}>
        <Add />
      </div>
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
