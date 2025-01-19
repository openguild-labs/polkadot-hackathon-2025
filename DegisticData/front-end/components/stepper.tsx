import { List, ListItem } from "@chakra-ui/react";

const steps = [
  { title: "First", isDone: true },
  { title: "Second", isDone: false },
  { title: "Third", isDone: false },
];

function StepperUI() {
  return (
    <List spacing={3}>
      {steps.map((step) => (
        <ListItem className="flex gap-2 items-center">
          <i
            className={`fa-solid fa-circle-check ${step.isDone ? "text-green-400" : "text-gray-400"}`}
          ></i>
          {step.title}
        </ListItem>
      ))}
    </List>
  );
}

export default StepperUI;
