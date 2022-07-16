import React from 'react';
import { Button, TextField, Input, Paper } from '@mui/material';
import { InputRepository } from 'react-declarative-hook-form';

export function init(variant: string) {
  const inputs = {
    button: React.forwardRef((props: any, ref: any) => <Button ref={ref} variant={'contained'} {...props} />),
    checkbox: React.forwardRef((props: any, ref: any) => <Input type="checkbox" ref={ref} {...props} />),
    color: React.forwardRef((props: any, ref: any) => <Input type="color" ref={ref} {...props} />),
    date: React.forwardRef((props: any, ref: any) => <Input type="date" ref={ref} {...props} />),
    'datetime-local': React.forwardRef((props: any, ref: any) => <Input type="datetime-local" ref={ref} {...props} />),
    email: React.forwardRef((props: any, ref: any) => <Input type="email" ref={ref} {...props} />),
    file: React.forwardRef((props: any, ref: any) => <Input type="file" ref={ref} {...props} />),
    hidden: React.forwardRef((props: any, ref: any) => <Input type="hidden" ref={ref} {...props} />),
    image: React.forwardRef((props: any, ref: any) => <Input type="image" ref={ref} {...props} />),
    month: React.forwardRef((props: any, ref: any) => <Input type="month" ref={ref} {...props} />),
    number: React.forwardRef((props: any, ref: any) => (
      <TextField ref={ref} variant={variant} {...props} label={props.placeholder} placeholder={''} />
    )),
    password: React.forwardRef((props: any, ref: any) => (
      <TextField type="password" ref={ref} variant={variant} {...props} label={props.placeholder} placeholder={''} />
    )),
    radio: React.forwardRef((props: any, ref: any) => <Input type="radio" ref={ref} {...props} />),
    range: React.forwardRef((props: any, ref: any) => <Input type="range" ref={ref} {...props} />),
    reset: React.forwardRef((props: any, ref: any) => <Input type="reset" ref={ref} {...props} />),
    search: React.forwardRef((props: any, ref: any) => <Input type="search" ref={ref} {...props} />),
    submit: React.forwardRef((props: any, ref: any) => (
      <Button type="submit" variant={'contained'} ref={ref} {...props} />
    )),
    tel: React.forwardRef((props: any, ref: any) => <Input type="tel" ref={ref} {...props} />),
    text: React.forwardRef((props: any, ref: any) => (
      <TextField ref={ref} variant={variant} {...props} label={props.placeholder} placeholder={''} />
    )),
    time: React.forwardRef((props: any, ref: any) => <Input type="time" ref={ref} {...props} />),
    url: React.forwardRef((props: any, ref: any) => <Input type="url" ref={ref} {...props} />),
    week: React.forwardRef((props: any, ref: any) => <Input type="week" ref={ref} {...props} />),
  };

  const wrapperComponent: React.ElementType = ({ children }) => (
    <Paper
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        margin: 2,
        flex: '1 0 calc(100% - 20px)',
        boxSizing: 'border-box',
        alignItems: 'flex-start',
      }}
    >
      {children}
    </Paper>
  );

  Object.entries(inputs).forEach(([type, component]) => {
    InputRepository.getRepository().set(type, component);
  });

  InputRepository.getRepository().setWrapperComponent(wrapperComponent);
}
