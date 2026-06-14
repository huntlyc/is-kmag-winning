import { CarList } from "./components/Cars";

export default async function Home() {
    return (
        <div className=" min-h-screen bg-linear-to-br from-blue-900 via-blue-950 to-blue-900 animate-gradient ">
            <main className="mx-auto max-w-5xl px-6 py-10">
                <CarList />
            </main>
        </div>
    );
}
