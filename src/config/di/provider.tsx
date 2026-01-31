"use client";

import { createContext, useContext, type ReactNode } from "react";
import { type Container, createContainer } from "./container";

const ContainerContext = createContext<Container | null>(null);

interface ContainerProviderProps {
  children: ReactNode;
}

export function ContainerProvider({ children }: ContainerProviderProps) {
  const container = createContainer();

  return (
    <ContainerContext.Provider value={container}>
      {children}
    </ContainerContext.Provider>
  );
}

export function useContainer(): Container {
  const context = useContext(ContainerContext);
  if (!context) {
    throw new Error("useContainer must be used within a ContainerProvider");
  }
  return context;
}
