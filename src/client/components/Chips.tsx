import React from "react";
import { Chip } from "@material-ui/core";

export interface ChipsProps {
  keywords: string[];
  triggerEvent?: (arg0: string) => void;
}

function Chips(props: ChipsProps): JSX.Element {
  const { keywords, triggerEvent } = props;
  const handleDelete = (keywordValue: string) => () => {
    if (typeof triggerEvent === "function") triggerEvent(keywordValue);
  };
  return (
    <>
      {keywords.map((x: string, i: number) => (
        <Chip
          style={{
            marginRight: "4px",
          }}
          variant="outlined"
          size="small"
          key={x + i}
          onDelete={handleDelete(x)}
          label={x}
        />
      ))}
    </>
  );
}

export default Chips;
