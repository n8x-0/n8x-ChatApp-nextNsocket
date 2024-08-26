import Header from "@/components/header/header";

export default function Home() {
  return (
    <div className="w-full h-screen bg-zinc-800 flex justify-center items-center p-3">
      <Header />
      <h1 className="md:text-7xl text-5xl md:w-[50%] w-full text-center font-mono tracking-tighter">Welcome to the nixiPixi, lets get social</h1>
    </div>
  );
}