import "react-hook-form";
import DeclarativeForm, { Schema } from "react-declarative-hook-form";
import { useState } from "react";
import { userFromDatabase } from "./userPetsTestData";

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

function UserPets() {
  const [result, setResult] = useState<typeof user>();
  return (
    <div className="App">
      <DeclarativeForm<typeof user>
        schema={user}
        defaultValues={userFromDatabase}
        onSubmit={setResult}
      />
      {result && <div id="result">{JSON.stringify(result)}</div>}
    </div>
  );
}

export default UserPets;
