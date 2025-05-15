import { AlertCircle } from "lucide-react"

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle className="w-12 h-12 text-slate-400 mb-4" />
      <h3 className="text-lg font-semibold text-slate-900 mb-2">No trends found</h3>
      <p className="text-slate-500 max-w-sm">
        There are no trends available at the moment. Try adjusting your filters or check back later.
      </p>
    </div>
  )
}