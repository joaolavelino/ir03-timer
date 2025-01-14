import {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { Cycle } from "../types";
import { CyclesReducer } from "../reducers/cycles/reducer";
import {
  addNewCycleAction,
  interruptCycleAction,
  markCurrentCycleAsCompleteAction,
} from "../reducers/cycles/actions";
import { differenceInSeconds } from "date-fns";

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
  const [cyclesState, dispatch] = useReducer(
    CyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    //initializer - initial state is what was declared on the second param of the useReducer
    (initialState) => {
      const storedStateAsJson = localStorage.getItem(
        "@ignite-timer:cycles-state-1.0.0"
      );
      return storedStateAsJson ? JSON.parse(storedStateAsJson) : initialState;
    }
  );

  //save on local storage
  useEffect(() => {
    const stateJson = JSON.stringify(cyclesState);
    localStorage.setItem("@ignite-timer:cycles-state-1.0.0", stateJson);
  }, [cyclesState]);

  const { cycles, activeCycleId } = cyclesState;

  const activeCycle = cycles.find((el: Cycle) => el.id == activeCycleId);

  //if the application is opened with a running cycle, we need the clock to start with the correct time
  const [secondsPassed, setSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate));
    }
    return 0;
  });

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
    // setSecondsPassed(0);
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
