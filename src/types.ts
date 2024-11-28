export type Cycle = {
  id: string;
  task: string;
  taskMinutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  completedDate?: Date;
};
