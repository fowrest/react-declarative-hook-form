# React Declarative Hook Form

This library allows you to create forms without dealing with any JSX but still leverage the work from the [react-hook-form](https://github.com/react-hook-form/react-hook-form) ecosystem.
The idea for this library is to be able to automatically generate a form based on a schema and pre-fill the form with a json object.

# Installation & Usage

`npm i react-hook-form react-declarative-hook-form`

And import `react-hook-form` before importing `react-declarative-hook-form`

# Example

More examples can be found in the the test-app directory were the library is tested with playwright.

Simple user form with no pre filled data.

```typescript
const user: Schema = {
  name: {
    type: "text",
  },
  password: {
    type: "password",
  },
};

const [result, setResult] = useState<typeof user>();
return <DeclarativeForm<typeof user> schema={user} onSubmit={setResult} />;
```

User schema with pets as an array that can be dynamically added in the form

```typescript
const user: Schema = {
  name: {
    type: "text",
  },
  password: {
    type: "password",
  },
  pets: [
    {
      name: { type: "text" },
      age: { type: "number" },
    },
  ],
};

const userFromDatabase = {
  name: "Bob",
  password: "abc",
  pets: [
    { name: "Alpha", age: 10 },
    { name: "Beta", age: 5 },
  ],
};

const [result, setResult] = useState<typeof user>();
return (
  <DeclarativeForm<typeof user>
    schema={user}
    defaultValues={userFromDatabase}
    onSubmit={setResult}
  />
);
```

User schema with pets and photo album with checkbox and photos.

```typescript
const user: Schema = {
  name: {
    type: "text",
  },
  password: {
    type: "password",
  },
  pets: [
    {
      name: { type: "text" },
      age: { type: "number" },
    },
  ],
  photoAlbum: {
    public: { type: "checkbox" },
    photos: [{ url: { type: "text" } }],
  },
};

const userFromDatabase = {
  name: "Bob",
  password: "abc",
  pets: [
    { name: "Alpha", age: 10 },
    { name: "Beta", age: 5 },
  ],
  photoAlbum: {
    public: false,
    photos: [
      { url: "www.example.com/photo1" },
      { url: "www.example.com/photo2" },
    ],
  },
};

const [result, setResult] = useState<typeof user>();
return (
  <DeclarativeForm<typeof user>
    schema={user}
    defaultValues={userFromDatabase}
    onSubmit={setResult}
  />
);
```

# Docs

TODO

# Styling

React Declarative Hook Form comes with a default theme that allows for creating automatic forms with native input elements for all input elements specified in the HTML standard. The default theme can be replaced by interacting with the `InputRepository` singleton to allow for support for your favorite UI library or for creating custom input types that does not exist in the HTML standard.

Example function that replaces `password` and `text` fields with Material UI versions. A full module for this is available in the `react-declarative-hook-form-mui` directory.

```typescript
function init(variant: string) {
  const inputs = {
    password: React.forwardRef((props: any, ref: any) => (
      <Input type="password" ref={ref} {...props} />
    )),
    text: React.forwardRef((props: any, ref: any) => (
      <TextField
        ref={ref}
        variant={variant}
        {...props}
        label={props.placeholder}
        placeholder={""}
      />
    )),
  };
  Object.entries(inputs).forEach(([type, component]) => {
    InputRepository.getRepository().set(type, component);
  });
}
```

# Development

For easier development of react-declarative-hook-form using the test app symlink react and react-declarative-hook-form.

From the root directory do:

```Bash
cd ./react-declarative-hook-form/node_modules/react
npm link
cd ../../
npm link
cd ../test-app/
npm link react
npm link react-declarative-hook-form
```
