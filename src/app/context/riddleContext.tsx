"use client";
// riddlesContext.tsx
import { createContext, useState, useContext } from "react";

type RiddlesContextValue = {
  oneIsAnswered: boolean;
  twoIsAnswered: boolean;
  threeIsAnswered: boolean;
  fourIsAnswered: boolean;
  setOneIsAnswered: (value: boolean) => void;
  setTwoIsAnswered: (value: boolean) => void;
  setThreeIsAnswered: (value: boolean) => void;
  setFourIsAnswered: (value: boolean) => void;
  decryptCounts: Record<number, number>; // key: riddle index (1-based)
  incrementDecryptCount: (riddleNumber: number) => void;
  gazo:string;
  setGazo:(value:string)=>void;
};

const RiddlesContext = createContext<RiddlesContextValue | null>(null);

export const RiddlesProvider = ({ children }: { children: React.ReactNode }) => {
  const [oneIsAnswered, setOneIsAnswered] = useState(false);
  const [twoIsAnswered, setTwoIsAnswered] = useState(false);
  const [threeIsAnswered, setThreeIsAnswered] = useState(false);
  const [fourIsAnswered, setFourIsAnswered] = useState(false);

  const [decryptCounts, setDecryptCounts] = useState<Record<number, number>>({1:0,2:0,3:0,4:0});
  const [gazo,setGazo]=useState("n");

  const incrementDecryptCount = (riddleNumber: number) => {
    setDecryptCounts((prev) => {
      prev[riddleNumber]+=1;
      return prev;
    });
  };

  return (
    <RiddlesContext.Provider
      value={{
        oneIsAnswered,
        twoIsAnswered,
        threeIsAnswered,
        fourIsAnswered,
        setOneIsAnswered,
        setTwoIsAnswered,
        setThreeIsAnswered,
        setFourIsAnswered,
        decryptCounts,
        incrementDecryptCount,
        gazo,
        setGazo
      }}
    >
      {children}
    </RiddlesContext.Provider>
  );
};

export const useRiddles = () => {
  const ctx = useContext(RiddlesContext);
  if (!ctx) throw new Error("useRiddles must be used within RiddlesProvider");
  return ctx;
};