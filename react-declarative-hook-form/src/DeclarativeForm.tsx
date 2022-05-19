import React, { useMemo } from "react";
import { useForm, UseFormProps } from "react-hook-form";
import buildForm from "./buildForm";
import { InputRepository } from "./inputRepository/InputRepository";
import { Schema } from "./Schema";

interface Props<T> {
  schema: Schema;
  onSubmit: (data: T) => void;
}

type JoinedProps<T> = Props<T> & UseFormProps;

/**
 * Component for rendering a form based on a schema with pre-filled values taken from the object
 * @param props Props forwarded to react-hook-form {@link https://react-hook-form.com/api/useform#props useForm}.</a>
 * @param props.schema Schema from which the form will be created based on.
 * @param props.onSubmit Callback when form is successfully submitted and passes validation
 */
function DeclarativeForm<T>({
  schema,
  onSubmit,
  ...useFormProps
}: JoinedProps<T>): React.ReactElement<JoinedProps<T>> {
  const {
    register,
    handleSubmit,
    control,
    /* watch, */
    formState: { errors },
  } = useForm({
    ...useFormProps,
  });
  const builtForm = useMemo(
    () => buildForm(schema, register, control),
    [schema, register, control]
  );

  const Button = InputRepository.getRepository().get("submit");

  return (
    <form
      // @ts-ignore
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: "inline-flex", flexDirection: "column" }}
    >
      {builtForm}
      <Button>Submit</Button>
    </form>
  );
}

export default DeclarativeForm;
