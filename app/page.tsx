import { Button } from "@/components/ui/button";
import Image from "next/image";
import Header from "./_components/Header";
import Hero from "./_components/Hero";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <Header></Header>
      <Hero></Hero>
    </div>
  );
}


export function xyz() {
  // aniket
  console.log("xyz");
}