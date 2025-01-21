import Image from "next/image";
import { HelloWorld } from "@/components"; 

export default function Home() {
  return (
    <div>
      {HelloWorld()}
    </div>
  );
}
