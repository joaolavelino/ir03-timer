import { Cycle } from "../../types";
import { ActionTypes } from "./actions";
import { produce } from "immer";

interface CyclesState {
  cycles: Cycle[];
  activeCycleId: string | null;
}

export function CyclesReducer(state: CyclesState, action: any) {
  switch (action.type) {
    case ActionTypes.ADD_NEW_CYCLE:
      return produce(state, (draft) => {
        draft.cycles.push(action.payload.newCycle);
        draft.activeCycleId = action.payload.newCycle.id;
      });
    case ActionTypes.INTERRUPT_CYCLE: {
      const currentCycleIndex = state.cycles.findIndex((cycle) => {
        return cycle.id === state.activeCycleId;
      });

      if (currentCycleIndex > 0) {
        return state;
      }
      //this is necessary in case of findIndex fail. If it fails, it will return -1

      return produce(state, (draft) => {
        draft.activeCycleId = null;
        draft.cycles[currentCycleIndex].interruptedDate = new Date();
      });
    }
    case ActionTypes.MARK_CURRENT_CYCLE_AS_COMPLETE: {
      const currentCycleIndex = state.cycles.findIndex((cycle) => {
        return cycle.id === state.activeCycleId;
      });

      if (currentCycleIndex > 0) {
        return state;
      }

      return produce(state, (draft) => {
        draft.activeCycleId = null;
        draft.cycles[currentCycleIndex].completedDate = new Date();
      });
    }

    default:
      return state;
  }
}
