import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale/de";
import { useContext } from "react";
import { CyclesContext } from "../../contexts/CyclesContext";
import { HistoryContainer, HistoryList, Status } from "./styles";

export function History() {
  const { cycles } = useContext(CyclesContext);

  return (
    <HistoryContainer>
      <h1>Mein Aufgabenverlauf</h1>
      <HistoryList>
        <table>
          <thead>
            <tr>
              <th>Aufgabe</th>
              <th>Dauer</th>
              <th>Anfang</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {cycles?.map((cycle) => (
              <tr key={cycle?.id}>
                <td>{cycle?.task}</td>
                <td>{cycle?.taskMinutesAmount} minuten</td>
                <td>
                  {formatDistanceToNow(cycle.startDate, {
                    addSuffix: true,
                    locale: de,
                  })}
                </td>
                <td>
                  {cycle?.completedDate && (
                    <Status status="complete">Vollendet</Status>
                  )}
                  {cycle?.interruptedDate && (
                    <Status status="canceled">Abgesagt</Status>
                  )}
                  {!cycle?.interruptedDate && !cycle.completedDate && (
                    <Status status="ongoing">Bearbeitung</Status>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  );
}
