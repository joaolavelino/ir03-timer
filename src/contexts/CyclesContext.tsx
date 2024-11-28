import { createContext, ReactNode, useState } from "react";
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

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [secondsPassed, setSecondsPassed] = useState(0);

  const activeCycle = cycles.find((el) => el.id == activeCycleId);

  function updateClock(timePassed: number) {
    setSecondsPassed(timePassed);
  }

  function setCurrentCycleAsComplete() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, completedDate: new Date() };
        } else {
          return cycle;
        }
      })
    );
    setActiveCycleId(null);
  }

  function createNewCycle(data: CreateCycleData) {
    const newCycle: Cycle = { ...data, id: uuidv4(), startDate: new Date() };
    setCycles((state) => [...state, newCycle]);
    setActiveCycleId(newCycle.id);
  }

  function interruptCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() };
        } else {
          return cycle;
        }
      })
    );
    setActiveCycleId(null);
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
