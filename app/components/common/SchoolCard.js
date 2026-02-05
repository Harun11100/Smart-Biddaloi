function SchoolCard({ icon: Icon, title, description }) {
  return (
    <div className="group relative h-full rounded-2xl border border-blue-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
      {/* Top Accent */}
      <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-blue-600 to-emerald-500" />

      <div className="flex flex-col items-center text-center px-6 py-10">
        {/* Icon */}
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition">
          <Icon size={28} />
        </div>

        {/* Title */}
        <h3 className="mb-3 text-lg sm:text-xl font-semibold text-gray-900">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
