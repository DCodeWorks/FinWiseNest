import { Pillar3aCalculator } from "@/components/Pillar3aCalculator";

export default function SwissHubPage() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Swiss Hub</h1>
        <p className="text-md text-gray-600 mt-2">
          Tools and calculators for Swiss financial planning.
        </p>
      </header>

      <main>
        <Pillar3aCalculator />
      </main>
    </div>
  );
}
