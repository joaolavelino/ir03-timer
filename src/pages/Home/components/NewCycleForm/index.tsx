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
      <label htmlFor="taskName">Vou trabalhar em</label>
      <datalist id="task-suggestions">
        <option value="Checar e-mails" />
        <option value="Atualização de plugins do Wordpress" />
        <option value="Design system" />
        <option value="Projeto da sede" />
      </datalist>
      <TaskInput
        type="text"
        id="taskName"
        placeholder="Dê um nome para o seu projeto"
        list="task-suggestions"
        disabled={!!activeCycle}
        {...register("task")}
      />
      <label htmlFor="taskMinutesAmount">durante</label>
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
      <span>minutos</span>
    </FormContainer>
  );
};
