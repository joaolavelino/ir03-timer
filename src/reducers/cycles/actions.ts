import { Cycle } from "../../types";

export enum ActionTypes {
  ADD_NEW_CYCLE = "ADD_NEW_CYCLE",
  INTERRUPT_CYCLE = "INTERRUPT_CYCLE",
  MARK_CURRENT_CYCLE_AS_COMPLETE = "MARK_CURRENT_CYCLE_AS_COMPLETE",
}

interface newCycleActionProps {
  type: ActionTypes.ADD_NEW_CYCLE;
  payload: { newCycle: Cycle };
}

interface markCurrentCycleFinishedProps {
  type: ActionTypes.MARK_CURRENT_CYCLE_AS_COMPLETE;
}

interface interruptedCycleActionProps {
  type: ActionTypes.INTERRUPT_CYCLE;
}

export type ActionsProp =
  | newCycleActionProps
  | markCurrentCycleFinishedProps
  | interruptedCycleActionProps;

export function addNewCycleAction(newCycle: Cycle) {
  return {
    type: ActionTypes.ADD_NEW_CYCLE,
    payload: { newCycle },
  };
}

export function interruptCycleAction() {
  return {
    type: ActionTypes.INTERRUPT_CYCLE,
  };
}

export function markCurrentCycleAsCompleteAction() {
  return { type: ActionTypes.MARK_CURRENT_CYCLE_AS_COMPLETE };
}
