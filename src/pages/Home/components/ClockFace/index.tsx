import { differenceInSeconds } from "date-fns";
import { useContext, useEffect } from "react";

import { CountdownContainer, Separator } from "./styles";
import { CyclesContext } from "../../../../contexts/CyclesContext";

export interface ClockFaceProps {}

export const ClockFace: React.FC<ClockFaceProps> = () => {
  const {
    activeCycle,
    activeCycleId,
    setCurrentCycleAsComplete,
    updateClock,
    secondsPassed,
  } = useContext(CyclesContext);

  const totalSeconds = activeCycle ? activeCycle.taskMinutesAmount * 60 : 0;

  useEffect(() => {
    let interval: number;
    if (activeCycle) {
      interval = setInterval(() => {
        const timeDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate
        );
        //if the time is over, complete the cycle
        if (timeDifference >= totalSeconds) {
          setCurrentCycleAsComplete();
          updateClock(0);
          console.log(activeCycleId);
        } else {
          //if it's not over
          updateClock(timeDifference);
        }
      }, 1000);
    }
    //essa função acontece antes do useEffect
    return () => {
      clearInterval(interval);
    };
  }, [
    activeCycle,
    totalSeconds,
    activeCycleId,
    setCurrentCycleAsComplete,
    updateClock,
  ]);

  const currentSeconds = activeCycle ? totalSeconds - secondsPassed : 0;
  const minutesAmount = Math.floor(currentSeconds / 60);
  const secondsAmount = currentSeconds % 60;

  const minutesString = String(minutesAmount).padStart(2, "0");
  const secondsString = String(secondsAmount).padStart(2, "0");

  //BROWSER TAB CUSTOMIZATION
  useEffect(() => {
    document.title = activeCycle
      ? `${minutesString}:${secondsString}`
      : "Ignite Timer";
  }, [minutesString, secondsString, activeCycle]);

  return (
    <CountdownContainer>
      <span>{minutesString[0]}</span>
      <span>{minutesString[1]}</span>
      <Separator>:</Separator>
      <span>{secondsString[0]}</span>
      <span>{secondsString[1]}</span>
    </CountdownContainer>
  );
};
