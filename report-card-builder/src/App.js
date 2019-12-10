import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

let Proficiency = ({ msg, setMsg, clear }) => {
  return (
    <div className="proficiency">
      <div className="scores">
        <button>at</button>
      </div>
      <input
        type="text"
        value={msg}
        onChange={e => {
          setMsg(e.target.value);
        }}
      />
      <button onClick={() => clear()}>remove</button>
    </div>
  );
};

function App() {
  let [index, setIndex] = useState(0);
  let [students, setStudents] = useState({});
  let [proficiencies, setProficiencies] = useState({});

  return (
    <div className="App">
      <h1>Hello Fahzher</h1>
      {Object.keys(proficiencies).map(id => {
        return (
          <Proficiency
            msg={proficiencies[id]}
            setMsg={newVal => {
              setProficiencies(proficiencies => {
                proficiencies[id] = newVal;
                return JSON.parse(JSON.stringify(proficiencies));
              });
            }}
            clear={() => {
              setProficiencies(proficiencies => {
                delete proficiencies[id];
                return JSON.parse(JSON.stringify(proficiencies));
              });
            }}
          />
        );
      })}
      <button
        onClick={() => {
          console.log(index);
          setProficiencies(proficiencies => {
            proficiencies[index] = "";
            setIndex(index => {
              return index + 1;
            });
            return JSON.parse(JSON.stringify(proficiencies));
          });
        }}
      >
        add new proficiency
      </button>
    </div>
  );
}

export default App;
