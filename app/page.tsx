import { Cars } from "./components/Cars";

export default async function Home() {
    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <main className="mx-auto max-w-5xl px-6 py-10">
                <Cars />
            </main>
        </div>
    );
}
