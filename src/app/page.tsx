import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-zinc-950">
      <div className="w-full h-screen flex flex-col">
        <ChatInterface />
      </div>
    </main>
  );
}
