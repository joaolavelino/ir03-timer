import { useEffect, useState } from "react";
import { Play } from "phosphor-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { differenceInSeconds } from "date-fns";

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
import { v4 as uuidv4 } from "uuid";

type newCycleFormData = zod.infer<typeof newCycleFormSchema>;

interface Cycle {
  id: string;
  task: string;
  taskMinutesAmount: number;
  startDate: Date;
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [secondsPassed, setSecondsPassed] = useState(0);

  const { register, handleSubmit, watch, reset } = useForm<newCycleFormData>({
    defaultValues: { task: "", taskMinutesAmount: 0 },
    resolver: zodResolver(newCycleFormSchema),
  });

  const activeCycle = cycles.find((el) => el.id == activeCycleId);

  useEffect(() => {
    let interval: number;
    if (activeCycle) {
      interval = setInterval(() => {
        setSecondsPassed(
          differenceInSeconds(new Date(), activeCycle.startDate)
        );
      }, 1000);
    }
    //essa função acontece antes do useEffect
    return () => {
      clearInterval(interval);
    };
  }, [activeCycle]);

  function handleCreateNewCycle(data: newCycleFormData) {
    const newCycle: Cycle = { ...data, id: uuidv4(), startDate: new Date() };
    setCycles((state) => [...state, newCycle]);
    setActiveCycleId(newCycle.id);
    setSecondsPassed(0);
    reset();
  }

  const taskValue = watch("task");
  const isSubmitDisabled = !taskValue; //variable with comprehensible name

  //CLOCK-FACE HANDLING

  const totalSeconds = activeCycle ? activeCycle.taskMinutesAmount * 60 : 0;
  const currentSeconds = activeCycle ? totalSeconds - secondsPassed : 0;
  const minutesAmount = Math.floor(currentSeconds / 60);
  const secondsAmount = currentSeconds % 60;

  const minutesString = String(minutesAmount).padStart(2, "0");
  const secondsString = String(secondsAmount).padStart(2, "0");

  useEffect(() => {
    document.title = activeCycle
      ? `${minutesString}:${secondsString}`
      : "Ignite Timer";
  }, [minutesString, secondsString, activeCycle]);

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
          <span>{minutesString[0]}</span>
          <span>{minutesString[1]}</span>
          <Separator>:</Separator>
          <span>{secondsString[0]}</span>
          <span>{secondsString[1]}</span>
        </CountdownContainer>

        <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
          <Play size={24}></Play>
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  );
}
