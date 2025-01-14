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
      <label htmlFor="taskName">Ich Arbeite an</label>
      <datalist id="task-suggestions">
        <option value="E-mails Abrufen" />
        <option value="Wordpress-Plugins aktualisieren" />
        <option value="Designsystem" />
        <option value="Büroprojekte" />
      </datalist>
      <TaskInput
        type="text"
        id="taskName"
        placeholder="Geben sie Ihrem Projekt einen Namen"
        list="task-suggestions"
        disabled={!!activeCycle}
        {...register("task")}
      />
      <label htmlFor="taskMinutesAmount">für</label>
      <MinutesAmountInput
        type="number"
        placeholder="00"
        id="taskMinutesAmount"
        min={5}
        max={60}
        step={5}
        disabled={!!activeCycle}
        {...register("taskMinutesAmount", { valueAsNumber: true })}
      />
      <span>minuten</span>
    </FormContainer>
  );
};
