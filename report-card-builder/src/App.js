import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

let Bubble = ({ selected, select, val }) => {
  return (
    <button
      className={"bubble " + (selected ? "selected" : "")}
      onClick={() => {
        select(val);
      }}
    >
      {val}
    </button>
  );
};

let Proficiency = ({ msg, setMsg, clear, id, score, setScore }) => {
  let [levels, setLevels] = useState([
    "Exceeding",
    "Meeting",
    "Developing",
    "Emerging"
  ]);

  return (
    <div className="proficiency">
      <div className="scores">
        {levels.map(level => {
          return (
            <Bubble
              val={level}
              selected={score == level}
              select={val => {
                setScore(val);
              }}
            />
          );
        })}
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

let verifyCompleted = (setStudents, proficiencies) => {
  setStudents(students => {
    Object.keys(students).forEach(student => {
      let complete = true;
      Object.keys(proficiencies).forEach(id => {
        if (!Object.keys(students[student].scores).includes(id)) {
          complete = false;
        }
      });
      students[student]["complete"] = complete;
    });

    return JSON.parse(JSON.stringify(students));
  });
};

function App() {
  let [index, setIndex] = useState(0);
  let [students, setStudents] = useState([]);
  let [focus, setFocus] = useState(0);
  let [adding, setAdding] = useState("");
  let [proficiencies, setProficiencies] = useState({});

  useEffect(
    () => {
      verifyCompleted(setStudents, proficiencies);
    },
    [proficiencies]
  );

  return (
    <div className="box">
      <div className="main">
        <h1>Hello Fahzher</h1>
        {students.length > 0
          ? <div>
              {students[focus].name}
              <button
                onClick={() => {
                  setFocus(focus => {
                    if (focus + 1 > students.length - 1) return 0;
                    return (focus += 1);
                  });
                }}
              >
                NEXT
              </button>

              {Object.keys(proficiencies).map(id => {
                return (
                  <Proficiency
                    key={id}
                    id={id}
                    setScore={val => {
                      setStudents(students => {
                        students[focus].scores[id] = val;

                        Object.keys(students).forEach(student => {
                          let complete = true;
                          Object.keys(proficiencies).forEach(id => {
                            if (
                              !Object.keys(students[student].scores).includes(
                                id
                              )
                            ) {
                              complete = false;
                            }
                          });
                          students[student]["complete"] = complete;
                        });

                        return JSON.parse(JSON.stringify(students));
                      });
                    }}
                    score={
                      Object.keys(students[focus].scores).includes(id)
                        ? students[focus].scores[id]
                        : -1
                    }
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
          : ""}
      </div>
      <div className="sidebar">
        <input
          type="text"
          value={adding}
          placeholder="Add a student..."
          onKeyUp={e => {
            let key = e.key;
            if (key == "Enter" && adding.length >= 2) {
              setStudents(students => {
                let newStudent = {
                  name: adding,
                  scores: {}
                };

                students[students.length] = newStudent;

                setAdding("");

                return JSON.parse(JSON.stringify(students));
              });
            }
          }}
          onChange={e => {
            setAdding(e.target.value);
          }}
        />
        {Object.keys(students).map(id => {
          return (
            <div
              style={students[id].complete ? { background: "#4a7" } : {}}
              onClick={() => {
                setFocus(id);
              }}
            >
              {students[id].name}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
