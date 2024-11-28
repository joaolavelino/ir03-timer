import { createContext, ReactNode, useReducer, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Cycle } from "../types";

type CreateCycleData = {
  task: string;
  taskMinutesAmount: number;
};

interface CyclesContextData {
  cycles: Cycle[];
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  secondsPassed: number;
  setCurrentCycleAsComplete: () => void;
  updateClock: (timePassed: number) => void;
  createNewCycle: (data: CreateCycleData) => void;
  interruptCycle: () => void;
}

export const CyclesContext = createContext({} as CyclesContextData);

interface CyclesContextProviderProps {
  children: ReactNode;
}

interface CyclesState {
  cycles: Cycle[];
  activeCycleId: string | null;
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    (state: CyclesState, action: any) => {
      switch (action.type) {
        case "ADD_NEW_CYCLE":
          return {
            ...state,
            cycles: [...state.cycles, action.payload.newCycle],
            activeCycleId: action.payload.newCycle.id,
          };
        case "INTERRUPT_CYCLE":
          return {
            ...state,
            activeCycleId: null,
            cycles: state.cycles.map((cycle) => {
              if (cycle.id === state.activeCycleId) {
                return { ...cycle, interruptedDate: new Date() };
              } else {
                return cycle;
              }
            }),
          };
        case "MARK_CURRENT_CYCLE_AS_COMPLETE":
          return {
            ...state,
            activeCycleId: null,
            cycles: state.cycles.map((cycle) => {
              if (cycle.id === state.activeCycleId) {
                return { ...cycle, completedDate: new Date() };
              } else {
                return cycle;
              }
            }),
          };
        default:
          return state;
      }
    },
    {
      cycles: [],
      activeCycleId: null,
    }
  );
  const [secondsPassed, setSecondsPassed] = useState(0);

  const { cycles, activeCycleId } = cyclesState;

  const activeCycle = cycles.find((el) => el.id == activeCycleId);

  function updateClock(timePassed: number) {
    setSecondsPassed(timePassed);
  }

  function setCurrentCycleAsComplete() {
    dispatch({
      type: "MARK_CURRENT_CYCLE_AS_COMPLETE",
    });
  }

  function createNewCycle(data: CreateCycleData) {
    const newCycle: Cycle = {
      ...data,
      id: uuidv4(),
      startDate: new Date(),
    };
    dispatch({
      type: "ADD_NEW_CYCLE",
      payload: { newCycle: newCycle },
    });
    // setCycles((state) => [...state, newCycle]);
    setSecondsPassed(0);
  }

  function interruptCycle() {
    dispatch({
      type: "INTERRUPT_CYCLE",
    });
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        secondsPassed,
        setCurrentCycleAsComplete,
        updateClock,
        createNewCycle,
        interruptCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}
