import { useState } from "react";

export default function useNextId() {
    const [lastId, setLastId] = useState(0);
    return {next:()=>{
      setLastId(lastId+1);
      return lastId;
    }};
  };