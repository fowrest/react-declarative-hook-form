import React from "react";
import { HTMLInputTypeAttribute } from "react";

type Input = React.ElementType;

/**
 * Repository for keeping all the input types along with the corresponding component.
 * The default components are able to be overwritten by using the set function on the InputRepository singleton.
 * InputRepository also supports custom input types.
 */
export class InputRepository {
  private static INSTANCE?: InputRepository;
  static getRepository() {
    if (!InputRepository.INSTANCE) {
      InputRepository.INSTANCE = new InputRepository();
    }

    return InputRepository.INSTANCE;
  }

  // Initialized with defaults
  // Needs to be able to handle a ref
  private inputs: Record<HTMLInputTypeAttribute, Input> = {
    button: React.forwardRef((props: any, ref: any) => (
      <input type="button" ref={ref} {...props} />
    )),
    checkbox: React.forwardRef((props: any, ref: any) => (
      <input type="checkbox" ref={ref} {...props} />
    )),
    color: React.forwardRef((props: any, ref: any) => (
      <input type="color" ref={ref} {...props} />
    )),
    date: React.forwardRef((props: any, ref: any) => (
      <input type="date" ref={ref} {...props} />
    )),
    "datetime-local": React.forwardRef((props: any, ref: any) => (
      <input type="datetime-local" ref={ref} {...props} />
    )),
    email: React.forwardRef((props: any, ref: any) => (
      <input type="email" ref={ref} {...props} />
    )),
    file: React.forwardRef((props: any, ref: any) => (
      <input type="file" ref={ref} {...props} />
    )),
    hidden: React.forwardRef((props: any, ref: any) => (
      <input type="hidden" ref={ref} {...props} />
    )),
    image: React.forwardRef((props: any, ref: any) => (
      <input type="image" ref={ref} {...props} />
    )),
    month: React.forwardRef((props: any, ref: any) => (
      <input type="month" ref={ref} {...props} />
    )),
    number: React.forwardRef((props: any, ref: any) => (
      <input type="number" ref={ref} {...props} />
    )),
    password: React.forwardRef((props: any, ref: any) => (
      <input type="password" ref={ref} {...props} />
    )),
    radio: React.forwardRef((props: any, ref: any) => (
      <input type="radio" ref={ref} {...props} />
    )),
    range: React.forwardRef((props: any, ref: any) => (
      <input type="range" ref={ref} {...props} />
    )),
    reset: React.forwardRef((props: any, ref: any) => (
      <input type="reset" ref={ref} {...props} />
    )),
    search: React.forwardRef((props: any, ref: any) => (
      <input type="search" ref={ref} {...props} />
    )),
    submit: React.forwardRef((props: any, ref: any) => (
      <input type="submit" ref={ref} {...props} />
    )),
    tel: React.forwardRef((props: any, ref: any) => (
      <input type="tel" ref={ref} {...props} />
    )),
    text: React.forwardRef((props: any, ref: any) => (
      <input type="text" ref={ref} {...props} />
    )),
    time: React.forwardRef((props: any, ref: any) => (
      <input type="time" ref={ref} {...props} />
    )),
    url: React.forwardRef((props: any, ref: any) => (
      <input type="url" ref={ref} {...props} />
    )),
    week: React.forwardRef((props: any, ref: any) => (
      <input type="week" ref={ref} {...props} />
    )),
  };

  public get(type: HTMLInputTypeAttribute): Input {
    const input = this.inputs[type];

    if (!input) {
      console.error(
        `Input of type ${type} does not exist in repository. Unable to render component`
      );
    }

    return input;
  }

  /**
   * Sets a component and type to the repository. The component needs to support ref prop.
   * @param type The type to add or replace
   * @param component The component that will be rendered from auto form
   */
  public set(type: HTMLInputTypeAttribute, component: Input) {
    this.inputs[type] = component;
  }
}
