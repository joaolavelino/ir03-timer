import { Play } from "phosphor-react";
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  TaskInput,
} from "./styles";

export function Home() {
  return (
    <HomeContainer>
      <form action="">
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
          />
          <label htmlFor="taskMinutesAmount">durante</label>
          <MinutesAmountInput
            type="number"
            name="Minutos"
            placeholder="00"
            id="taskMinutesAmount"
            min={5}
            max={60}
            step={5}
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

        <StartCountdownButton type="submit">
          <Play size={24}></Play>
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  );
}
