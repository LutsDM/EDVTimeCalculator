import { ReactNode } from "react"

type Props = {
  title: string
  children: ReactNode
}

export default function TimeBlock({ title, children }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-3">
      <h2 className="text-sm font-semibold text-blue-600 uppercase">
        {title}
      </h2>

      {children}
    </div>
  )
}
