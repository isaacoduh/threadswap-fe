"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  CATEGORIES,
  CONDITIONS,
  SIZES,
  CreateListingFormData,
} from "../schemas/listing.schema";

const POPULAR_BRANDS = [
  "Nike",
  "Adidas",
  "Zara",
  "H&M",
  "Levi's",
  "Gucci",
  "Prada",
  "Ralph Lauren",
  "Uniqlo",
  "Cos",
  "Arket",
  "Massimo Dutti",
  "Mango",
  "ASOS",
  "New Balance",
];


interface ItemDetailsFormProps {
    form: UseFormReturn<CreateListingFormData>;
}

function FieldError({message}: {message?: string}) {
    if (!message) return null;
    return (
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-destructive">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {message}
        </p>
    );
}


export function ItemDetailsForm({form}: ItemDetailsFormProps) {
    const {
        register,
        setValue,
        watch,
        formState: { errors },
    } = form;
    const [brandSuggestions, setBrandSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const selectedCategory = watch('category')
    const selectedSize = watch('size')
    const selectedCondition = watch('condition')
    const brandValue = watch('brand')
    const titleLength = watch('title')?.length || 0;
    const descLength = watch('description')?.length || 0;

    const handleBrandInput = (value: string) => {
        setValue('brand', value, {shouldValidate: true})
        if(value.length > 0) {
            const filtered = POPULAR_BRANDS.filter((b) => b.toLowerCase().includes(value.toLowerCase()))
            setBrandSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setShowSuggestions(false)
        }
    }

    const selectBrand = (brand: string) => {
        setValue('brand', brand, {shouldValidate: true})
        setShowSuggestions(false);
    }

    return (
        <div className="space-y-6">
            {/* Title */}
            <div>
                <div className="mb-2 flex items-baseline justify-between">
                    <Label htmlFor="title" className="font-medium">
                        Title
                    </Label>
                    <span className="text-xs text-muted-foreground">{titleLength}/100</span>
                </div>
                <Input
                    id="title"
                    {...register('title')}
                    placeholder="e.g., Vintage Levi's 501 Jeans"
                    className={cn("h-12 rounded-xl", errors.title && "border-destructive")}
                />
                <FieldError message={errors.title?.message} />
            </div>

            {/* Category */}
            <div>
                <Label className="mb-2 block font-medium">Category</Label>
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                        <button key={cat.value} type="button" onClick={() => setValue("category", cat.value, {shouldValidate: true})}
                            className={cn(
                                "rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
                                selectedCategory === cat.value
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            )}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
                <FieldError message={errors.category?.message} />
            </div>

            {/* Brand */}
            <div className="relative">
                <Label htmlFor="brand" className="mb-2 block font-medium">
                    Brand
                </Label>
                <Input 
                    id="brand" value={brandValue || ""} 
                    onChange={(e) => handleBrandInput(e.target.value)}
                    onFocus={() => {
                        if (brandSuggestions.length > 0) setShowSuggestions(true);
                    }}
                    onBlur={() => {
                        // Delay to allow click on suggestion
                        setTimeout(() => setShowSuggestions(false), 150)
                    }}
                    placeholder="Start typing to search brands..."
                    className={cn("h-12 rounded-xl", errors.brand && "border-destructive")}
                    autoComplete="off"
                />
                {showSuggestions && (
                    <div className="">
                        {brandSuggestions.map((brand) => (
                            <button 
                                key={brand} 
                                type="button" 
                                onMouseDown={() => selectBrand(brand)}
                                className="w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-muted"
                            >
                                {brand}
                            </button>
                        ))}
                    </div>
                )}
                <FieldError message={errors.brand?.message} />
            </div>

            {/* Size */}
            
            <div>
                <Label className="mb-2 block font-medium">Size</Label>
                <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => (
                    <button
                    key={size}
                    type="button"
                    onClick={() => setValue("size", size, { shouldValidate: true })}
                    className={cn(
                        "min-w-[48px] rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
                        selectedSize === size
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    )}
                    >
                    {size}
                    </button>
                ))}
                </div>
                <FieldError message={errors.size?.message} />
            </div>

            {/* Condition */}
            <div>
                <Label className="mb-2 block font-medium">Condition</Label>
                <div className="grid grid-cols-2 gap-2">
                {CONDITIONS.map((cond) => (
                    <button
                    key={cond.value}
                    type="button"
                    onClick={() => setValue("condition", cond.value, { shouldValidate: true })}
                    className={cn(
                        "flex flex-col items-start rounded-xl border-2 p-3 text-left transition-all",
                        selectedCondition === cond.value
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-transparent bg-secondary hover:bg-secondary/80"
                    )}
                    >
                    <span className="text-sm font-medium">{cond.label}</span>
                    <span className="text-xs text-muted-foreground">{cond.description}</span>
                    </button>
                ))}
                </div>
                <FieldError message={errors.condition?.message} />
            </div>

            {/* Price */}
            <div>
                <Label htmlFor="price" className="mb-2 block font-medium">
                Price
                </Label>
                <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-muted-foreground">
                    £
                </span>
                <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...register("price", { valueAsNumber: true })}
                    placeholder="0.00"
                    className={cn(
                    "h-12 rounded-xl pl-8 text-lg",
                    errors.price && "border-destructive"
                    )}
                    min={0}
                />
                </div>
                <FieldError message={errors.price?.message} />
            </div>

            {/* Color (optional) */}
            <div>
                <div className="mb-2 flex items-baseline gap-2">
                <Label htmlFor="color" className="font-medium">
                    Colour
                </Label>
                <span className="text-xs text-muted-foreground">Optional</span>
                </div>
                <Input
                id="color"
                {...register("color")}
                placeholder="e.g., Navy Blue"
                className="h-12 rounded-xl"
                maxLength={30}
                />
            </div>

            {/* Description */}
            <div>
                <div className="mb-2 flex items-baseline justify-between">
                <Label htmlFor="description" className="font-medium">
                    Description
                </Label>
                <span className="text-xs text-muted-foreground">{descLength}/2000</span>
                </div>
                <Textarea
                id="description"
                {...register("description")}
                placeholder="Describe your item: size fit, condition details, reason for selling..."
                className={cn(
                    "min-h-[120px] rounded-xl resize-none",
                    errors.description && "border-destructive"
                )}
                maxLength={2000}
                />
                <FieldError message={errors.description?.message} />
            </div>
        </div>
    )
}