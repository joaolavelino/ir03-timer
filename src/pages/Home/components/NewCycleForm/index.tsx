import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";

import { useContext } from "react";

import { useFormContext } from "react-hook-form";
import { CyclesContext } from "../../../../contexts/CyclesContext";

export interface NewCycleFormProps {}

export const NewCycleForm: React.FC<NewCycleFormProps> = () => {
  const { activeCycle } = useContext(CyclesContext);
  const { register } = useFormContext();

  return (
    <FormContainer>
      <label htmlFor="taskName">I'm working on</label>
      <datalist id="task-suggestions">
        <option value="Check e-mails" />
        <option value="Wordpress plugins update" />
        <option value="Design system" />
        <option value="Office projects" />
      </datalist>
      <TaskInput
        type="text"
        id="taskName"
        placeholder="Give your project a name"
        list="task-suggestions"
        disabled={!!activeCycle}
        {...register("task")}
      />
      <label htmlFor="taskMinutesAmount">during</label>
      <MinutesAmountInput
        type="number"
        placeholder="00"
        id="taskMinutesAmount"
        min={1}
        max={60}
        step={5}
        disabled={!!activeCycle}
        {...register("taskMinutesAmount", { valueAsNumber: true })}
      />
      <span>minutes</span>
    </FormContainer>
  );
};
