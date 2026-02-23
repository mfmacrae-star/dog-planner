import { breeds, monthNames } from "../data/breeds";

export function BreedBook() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-12 mb-8 text-center border-4 border-amber-200">
          <h1 className="text-5xl font-serif text-gray-800 mb-4">Dog Breed Histories</h1>
          <p className="text-xl text-gray-600 italic">A Year of Canine Heritage & Stories</p>
          <div className="mt-8 text-gray-500">Featuring 12 remarkable breeds, one for each month</div>
        </div>
        {breeds.map((breed, index) => (
          <div key={breed.month} className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
            <div className="grid md:grid-cols-5 gap-6">
              <div className="md:col-span-2">
                <div className="relative h-full min-h-[300px]">
                  <img src={breed.imageUrl} alt={breed.name} className={`w-full h-full ${[5,9].includes(breed.month) ? "object-contain bg-gray-100" : "object-cover"}`} />
                  <div className="absolute top-4 left-4 bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold">{monthNames[breed.month - 1]}</div>
                </div>
              </div>
              <div className="md:col-span-3 p-8">
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-6xl font-serif text-amber-600">{breed.month}</span>
                  <h2 className="text-3xl font-serif text-gray-800">{breed.name}</h2>
                </div>
                <div className="mb-4">
                  <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-2">Overview</h3>
                  <p className="text-gray-600 italic">{breed.shortSummary}</p>
                </div>
                <div>
                  <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-2">History & Heritage</h3>
                  <p className="text-gray-700 leading-relaxed">{breed.history}</p>
                </div>
                {index < breeds.length - 1 && <div className="mt-6 pt-6 border-t border-gray-200"><div className="text-center text-gray-400 text-sm">◆ ◆ ◆</div></div>}
              </div>
            </div>
          </div>
        ))}
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center border-4 border-amber-200">
          <p className="text-xl text-gray-600 italic">May these noble companions inspire your days throughout the year</p>
          <div className="mt-6 text-gray-500">🐾</div>
        </div>
      </div>
    </div>
  );
}
