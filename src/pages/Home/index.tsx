import { Play } from "phosphor-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";

import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  TaskInput,
} from "./styles";

const newCycleFormSchema = zod.object({
  task: zod.string().min(1, "Informe o nome da tarefa"),
  taskMinutesAmount: zod
    .number()
    .min(5, "O ciclo deve ter no mínumo 5 minutos")
    .max(60, "O ciclo deve ter no máximo 60 minutos"),
});

type newCycleFormData = zod.infer<typeof newCycleFormSchema>;

export function Home() {
  const { register, handleSubmit, watch, reset } = useForm<newCycleFormData>({
    defaultValues: { task: "", taskMinutesAmount: 0 },
    resolver: zodResolver(newCycleFormSchema),
  });

  function handleCreateNewCycle(data: newCycleFormData) {
    console.log(data);
    reset();
  }

  const taskValue = watch("task");
  const isSubmitDisabled = !taskValue; //variable with comprehensible name

  return (
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
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
            {...register("task")}
          />
          <label htmlFor="taskMinutesAmount">durante</label>
          <MinutesAmountInput
            type="number"
            placeholder="00"
            id="taskMinutesAmount"
            min={5}
            max={60}
            step={5}
            {...register("taskMinutesAmount", { valueAsNumber: true })}
          />
          <span>minutos</span>
        </FormContainer>

        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>

        <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
          <Play size={24}></Play>
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  );
}
