import { zodResolver } from "@hookform/resolvers/zod";
import { Play, XCircle } from "phosphor-react";
import { FormProvider, useForm } from "react-hook-form";
import * as zod from "zod";
import { ClockFace } from "./components/ClockFace";
import { NewCycleForm } from "./components/NewCycleForm";
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from "./styles";
import { useContext } from "react";
import { CyclesContext } from "../../contexts/CyclesContext";

const newCycleFormSchema = zod.object({
  task: zod.string().min(1, "Informe o nome da tarefa"),
  taskMinutesAmount: zod
    .number()
    .min(1, "O ciclo deve ter no mínumo 1 minutos")
    .max(60, "O ciclo deve ter no máximo 60 minutos"),
});

export type newCycleFormData = zod.infer<typeof newCycleFormSchema>;

export function Home() {
  const { activeCycleId, createNewCycle, interruptCycle } =
    useContext(CyclesContext);

  const newCycleForm = useForm<newCycleFormData>({
    defaultValues: { task: "", taskMinutesAmount: 0 },
    resolver: zodResolver(newCycleFormSchema),
  });

  const { handleSubmit, watch, reset } = newCycleForm;

  const taskValue = watch("task");
  const isSubmitDisabled = !taskValue; //variable with comprehensible name

  function handleCreateNewCycle(data: newCycleFormData) {
    createNewCycle(data);
    reset();
  }

  return (
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
        {/* FormProvider coloca aquelas informações e funções do RHF em um contexto para ser usado num componente filho */}
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <ClockFace />
        {!activeCycleId ? (
          <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
            <Play size={24}></Play>
            Começar
          </StartCountdownButton>
        ) : (
          <StopCountdownButton type="button" onClick={interruptCycle}>
            <XCircle size={24}></XCircle>
            Interromper
          </StopCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}
