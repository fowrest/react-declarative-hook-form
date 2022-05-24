import "react-hook-form";
import DeclarativeForm, {
  Schema,
  SpecialType,
} from "react-declarative-hook-form";
import { useState } from "react";
import { parentObject } from "./parentTestData";

const child: Schema = {
  name: {
    type: "text",
  },
  measurement: {
    type: SpecialType.Meta,
    children: {
      height: {
        type: "number",
      },
      weight: {
        type: "number",
      },
    },
  },
  friends: [{ friend: { type: "text" } }],
};

const parent: Schema = {
  name: {
    id: "a",
    type: "text",
  },
  lastName: {
    type: "text",
  },
  kids: {
    type: SpecialType.Meta,
    children: {
      favorite: {
        type: "text",
      },
      data: [child],
    },
  },
  phoneNumbers: [
    {
      number: { type: "text" },
    },
  ],
};

function App() {
  const [result, setResult] = useState<string>();
  return (
    <div className="App">
      <DeclarativeForm<typeof parentObject>
        schema={parent}
        defaultValues={parentObject}
        onSubmit={(data) => {
          setResult(JSON.stringify(data));
        }}
      />
      {result && <div id="result">{result}</div>}
    </div>
  );
}

export default App;
