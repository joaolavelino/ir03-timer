import { zodResolver } from "@hookform/resolvers/zod";
import { differenceInSeconds } from "date-fns";
import { Play, XCircle } from "phosphor-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as zod from "zod";

import { v4 as uuidv4 } from "uuid";
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  StopCountdownButton,
  TaskInput,
} from "./styles";

const newCycleFormSchema = zod.object({
  task: zod.string().min(1, "Informe o nome da tarefa"),
  taskMinutesAmount: zod
    .number()
    .min(1, "O ciclo deve ter no mínumo 1 minutos")
    .max(60, "O ciclo deve ter no máximo 60 minutos"),
});

type newCycleFormData = zod.infer<typeof newCycleFormSchema>;

interface Cycle {
  id: string;
  task: string;
  taskMinutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  completedDate?: Date;
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

  //CLOCK-FACE HANDLING

  const totalSeconds = activeCycle ? activeCycle.taskMinutesAmount * 60 : 0;
  const currentSeconds = activeCycle ? totalSeconds - secondsPassed : 0;
  const minutesAmount = Math.floor(currentSeconds / 60);
  const secondsAmount = currentSeconds % 60;

  const minutesString = String(minutesAmount).padStart(2, "0");
  const secondsString = String(secondsAmount).padStart(2, "0");

  //TIMER MANAGEMENT

  useEffect(() => {
    let interval: number;
    if (activeCycle) {
      interval = setInterval(() => {
        const timeDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate
        );
        //if the time is over
        if (timeDifference >= totalSeconds) {
          setCycles((state) =>
            state.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, completedDate: new Date() };
              } else {
                return cycle;
              }
            })
          );
          //reset the clock
          setSecondsPassed(0);
          //no active cycles
          setActiveCycleId(null);
        } else {
          //if it's not over
          setSecondsPassed(timeDifference);
        }
      }, 1000);
    }
    //essa função acontece antes do useEffect
    return () => {
      clearInterval(interval);
    };
  }, [activeCycle, totalSeconds, activeCycleId]);

  function handleCreateNewCycle(data: newCycleFormData) {
    const newCycle: Cycle = { ...data, id: uuidv4(), startDate: new Date() };
    setCycles((state) => [...state, newCycle]);
    setActiveCycleId(newCycle.id);
    setSecondsPassed(0);
    reset();
  }

  const taskValue = watch("task");
  const isSubmitDisabled = !taskValue; //variable with comprehensible name

  //CYCLE INTERRUPTION

  function handleInterruptCycle() {
    setActiveCycleId(null);
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() };
        } else {
          return cycle;
        }
      })
    );
    setSecondsPassed(0);
  }

  //BROWSER TAB CUSTOMIZATION

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

        <CountdownContainer>
          <span>{minutesString[0]}</span>
          <span>{minutesString[1]}</span>
          <Separator>:</Separator>
          <span>{secondsString[0]}</span>
          <span>{secondsString[1]}</span>
        </CountdownContainer>

        {!activeCycleId ? (
          <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
            <Play size={24}></Play>
            Começar
          </StartCountdownButton>
        ) : (
          <StopCountdownButton type="button" onClick={handleInterruptCycle}>
            <XCircle size={24}></XCircle>
            Interromper
          </StopCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}
