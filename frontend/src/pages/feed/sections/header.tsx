import { Repeat2 } from 'lucide-react'
import { Separator } from '../../../components/ui/separator'

export function Header() {
  return (
    <header className="flex flex-col sticky top-0 bg-stone-950">
      <div className="flex items-center justify-start gap-2 py-2 px-10 text-orange-500">
        <Repeat2 className="size-7" />

        <span className="text-lg font-semibold">Loop</span>
      </div>

      <Separator />
    </header>
  )
}
