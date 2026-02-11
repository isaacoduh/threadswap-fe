"use client"
import { useRouter } from "next/navigation";
import {
  Shirt,
  Footprints,
  Watch,
  Gem,
  ShoppingBag,
  Glasses,
  Crown,
  Layers,
  type LucideIcon,
} from "lucide-react";


interface CategoryItem {
    value: string;
    label: string;
    icon: LucideIcon;
    gradient: string
}


const CATEGORIES: CategoryItem[] = [
  { value: "TOPS", label: "Tops", icon: Shirt, gradient: "from-rose-400 to-pink-500" },
  { value: "BOTTOMS", label: "Bottoms", icon: Layers, gradient: "from-blue-400 to-indigo-500" },
  { value: "DRESSES", label: "Dresses", icon: Crown, gradient: "from-purple-400 to-violet-500" },
  { value: "OUTERWEAR", label: "Outerwear", icon: Shirt, gradient: "from-amber-400 to-orange-500" },
  { value: "SHOES", label: "Shoes", icon: Footprints, gradient: "from-emerald-400 to-green-500" },
  { value: "ACCESSORIES", label: "Accessories", icon: Watch, gradient: "from-cyan-400 to-teal-500" },
  { value: "BAGS", label: "Bags", icon: ShoppingBag, gradient: "from-fuchsia-400 to-pink-500" },
  { value: "JEWELRY", label: "Jewelry", icon: Gem, gradient: "from-yellow-400 to-amber-500" },
  { value: "OTHER", label: "Other", icon: Glasses, gradient: "from-slate-400 to-zinc-500" },
];

export function CategoryChips() {
    const router = useRouter()

    const handleClick = (category: string) => {
        router.push(`/search?category=${category}`);
    }

    return (
        <section className="mt-6">
            <h3 className="mb-3 px-4 text-base font-bold">Browse by category</h3>
            <div className="scrollbar-none flex gap-3 overflow-x-auto px-4 pb-1">
                {CATEGORIES.map((cat) => {
                    const Icon = cat.icon
                    return (
                        <button key={cat.value} onClick={() => handleClick(cat.value)}
                        className="flex shrink-0 flex-col items-center gap-1.5 transition-transform active:scale-95"
                        >
                            <div
                                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${cat.gradient} shadow-md`}
                            >
                                <Icon className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-[11px] font-semibold">{cat.label}</span>
                        </button>
                    )
                })}
            </div>
        </section>
    )
}