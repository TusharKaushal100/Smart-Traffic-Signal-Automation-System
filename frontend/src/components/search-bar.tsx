interface SearchProps {
  search: string
  setSearch: (value: string) => void
}

export const SearchBar = ({ search, setSearch }: SearchProps) => {

  return (
    <div className="flex items-center mb-6">

      <div className="relative w-96">

      
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
        </div>

        <input
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm text-slate-700 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200"
          placeholder="Search intersection..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

       
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

      </div>

    </div>
  )
}