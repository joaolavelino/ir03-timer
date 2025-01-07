import { createContext, ReactNode, useReducer, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Cycle } from "../types";
import { CyclesReducer } from "../reducers/cycles/reducer";
import {
  addNewCycleAction,
  interruptCycleAction,
  markCurrentCycleAsCompleteAction,
} from "../reducers/cycles/actions";

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

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(CyclesReducer, {
    cycles: [],
    activeCycleId: null,
  });
  const [secondsPassed, setSecondsPassed] = useState(0);

  const { cycles, activeCycleId } = cyclesState;

  const activeCycle = cycles.find((el) => el.id == activeCycleId);

  function updateClock(timePassed: number) {
    setSecondsPassed(timePassed);
  }

  function setCurrentCycleAsComplete() {
    dispatch(markCurrentCycleAsCompleteAction());
  }

  function createNewCycle(data: CreateCycleData) {
    const newCycle: Cycle = {
      ...data,
      id: uuidv4(),
      startDate: new Date(),
    };
    dispatch(addNewCycleAction(newCycle));
    setSecondsPassed(0);
  }

  function interruptCycle() {
    dispatch(interruptCycleAction());
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
