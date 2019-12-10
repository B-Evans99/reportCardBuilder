import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import { FaPlusSquare, FaMinusSquare } from "react-icons/fa";
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
        placeholder="...add a proficiency"
        type="text"
        value={msg}
        onChange={e => {
          setMsg(e.target.value);
        }}
      />
      <FaMinusSquare className="clearProficiency" onClick={() => clear()} />
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

function download(filename, text) {
  text = text.replace(/\n/g, "%0D%0A");
  var element = document.createElement("a");
  element.setAttribute("href", "data:text/plain;charset=utf-8," + text);
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function App() {
  let [index, setIndex] = useState(1);
  let [students, setStudents] = useState([]);
  let [focus, setFocus] = useState(0);
  let [adding, setAdding] = useState("");
  let [proficiencies, setProficiencies] = useState({ 0: "" });

  useEffect(
    () => {
      let studentNames = document.getElementsByClassName("studentName");
      if (studentNames.length != 0) {
        let student = document.getElementsByClassName("studentName")[0];
        console.log("flipping");
        student.style.animation = "none";
        setTimeout(() => {
          student.style.animation = "";
        }, 30);
      }
    },
    [focus]
  );

  useEffect(
    () => {
      verifyCompleted(setStudents, proficiencies);
    },
    [proficiencies]
  );

  return (
    <div className="box">
      <div className="main">
        <div className="squeezed">
          <h1>Hello Fahzher</h1>
          {students.length > 0
            ? <div>
                <div className="studentName studentNameChanged">
                  <span>
                    {students[focus].name}
                  </span>

                  <button
                    onClick={() => {
                      setFocus(focus => {
                        focus += 1;

                        if (focus > students.length - 1) {
                          focus = 0;
                        }

                        if (students[focus] == undefined) {
                          return 0;
                        }

                        return focus;
                      });
                    }}
                  >
                    NEXT
                  </button>
                </div>

                {Object.keys(proficiencies).map((id, i) => {
                  return (
                    <Proficiency
                      key={id}
                      id={id}
                      setScore={val => {
                        setStudents(students => {
                          if (students[focus].scores[id] == val) {
                            delete students[focus].scores[id];
                          } else {
                            students[focus].scores[id] = val;
                          }
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

                        if (i == Object.keys(proficiencies).length - 1) {
                          setTimeout(() => {
                            setFocus(focus => {
                              focus += 1;

                              if (focus > students.length - 1) {
                                focus = 0;
                              }

                              if (students[focus] == undefined) {
                                return 0;
                              }

                              return focus;
                            });
                          }, 500);
                        }
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
                <div className="proficiency">
                  <FaPlusSquare
                    className="addProficiency"
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
                  />
                </div>
              </div>
            : ""}
        </div>
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
              className={"student " + (students[id].complete ? "complete" : "")}
              onClick={() => {
                setFocus(id);
              }}
            >
              {students[id].name}
            </div>
          );
        })}
        <br />
        <br />
        <div className="download">
          <button
            onClick={() => {
              let downloadFile = "";

              Object.keys(students).forEach(id => {
                let student = students[id];
                downloadFile += student.name + "\n\n";
                Object.keys(student.scores).forEach(score => {
                  downloadFile +=
                    student.scores[score] +
                    "    " +
                    proficiencies[score] +
                    "\n\n";
                });
                downloadFile += "\n\n\n";
              });

              download("Student Grades.txt", downloadFile);
            }}
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
