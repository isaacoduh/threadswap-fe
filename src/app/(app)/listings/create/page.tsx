"use client"

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createListingSchema, CreateListingFormData } from "@/features/listings/schemas/listing.schema";
import { useCreateListing } from "@/features/listings/hooks/useListings";
import { ImageUploader } from "@/features/listings/components/ImageUploader";
import { ItemDetailsForm } from "@/features/listings/components/ItemDetailsForm";
import { ListingPreview } from "@/features/listings/components/ListingPreview";

interface ImageFile {
    file: File, 
    preview: string;
}

const STEPS = [
  { id: 1, title: "Photos", fields: ["images"] as const },
  {
    id: 2,
    title: "Details",
    fields: ["title", "category", "brand", "size", "condition", "price", "description"] as const,
  },
  { id: 3, title: "Preview", fields: [] as const },
];

export default function CreateListingPage() {
    const router = useRouter()
    const [step, setStep] = useState(1);
    const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);

    const {mutate: createListing, isPending} = useCreateListing()

    const form = useForm<CreateListingFormData>({
        resolver: zodResolver(createListingSchema),
        defaultValues: {
            images: [],
            title: "",
            category: undefined,
            brand: "",
            size: undefined,
            condition: undefined,
            price: undefined,
            description: "",
            color: "",
        },
        mode:'onChange'
    })

    const {trigger, getValues, setValue, formState} = form;

    // sync image files with form state
    const handleImagesChange = useCallback(
        (files: ImageFile[]) => {
            setImageFiles(files);
            setValue("images", files.map((f) => f.file), {shouldValidate: true})
        },
        [setValue]
    )

    // validate current step fields before advancing
    const handleNext = async () => {
        const currentStep = STEPS[step - 1];
        const valid = await trigger(currentStep.fields as any)
        if (valid) setStep((s) => Math.min(s + 1, 3))
    }

    const handleBack = () => setStep((s) => Math.max(s - 1, 1));

    const handlePublish = () => {
        const data = getValues()
        createListing({
            title: data.title,
            description: data.description,
            price: data.price,
            category: data.category as any,
            size: data.size,
            brand: data.brand,
            condition: data.condition as any,
            color: data.color,
            images: data.images,
        },{
            onSuccess: () => router.push("/"),
            onError: (err) => {
                // TODO: toast notification
                console.error("Failed to create listing:", err);
            }
        })
    }


    // Deterimine if current step's continue button should be enabled
    const canAdvance = (() => {
        if (step === 1) return imageFiles.length > 0;
        if(step === 2) {
            const {title, category, brand, size, condition, price, description} = form.watch()
            return !!(title && category && brand && size && condition && price && description);
        }  
        return true
    })();

    return (
        <div className="min-h-screen bg-background pb-safe">
            {/* Header */}
            <header className="sticky top-0 z-40 flex items-center gap-4 border-b border-border bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                {step > 1 ? (
                <button onClick={handleBack}
                className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-muted"
                aria-label="Go back">
                    <ChevronLeft className="h-5 w-5" />
                </button>
                ): (
                    <Link href="/"
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-muted"
            aria-label="Cancel">
                        <X className="h-5 w-5" />
                    </Link>
                )} 
                <h1 className="flex-1 text-lg font-semibold">Create Listing</h1>
                <span className="text-sm text-muted-foreground">{step}/{STEPS.length}</span>
            </header>

            {/* Step Progress Bar */}
            <div className="flex gap-2 px-4 py-3">
                {STEPS.map((s) => (
                    <div key={s.id}
                    className={cn(
                        "h-1 flex-1 rounded-full transition-colors duration-300",
                        s.id <= step ? "bg-primary" : "bg-secondary"
                    )}
                />
                ))}
            </div>

            {/* Step Content */}
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="p-4 pb-28">
                    {step === 1 && (
                        <>
                            <h2 className="mb-1 text-xl font-semibold">Add Photos</h2>
                            <p className="mb-6 text-sm text-muted-foreground">
                                Add up to 8 photos. First photo will be the cover.
                        </p>
                        <ImageUploader 
                            images={imageFiles}
                            onChange={handleImagesChange}
                            error={formState.errors.images?.message}
                        />
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h2 className="mb-6 text-xl font-semibold">Item Details</h2>
                            <ItemDetailsForm form={form} />
                        </>
                    )}
                    {step === 3 && (
                        <>
                            <h2 className="mb-1 text-xl font-semibold">Preview Your Listing</h2>
                            <p className="mb-6 text-sm text-muted-foreground">
                                This is how your buyers will see your item.
                            </p>
                            <ListingPreview data={getValues()} images={imageFiles} />
                        </>
                    )}
                </div>
            </form>
            {/* Sticky footer action */}
            <div className="fixed inset-x-0 bottom-0 border-t border-border bg-card/95 p-4 pb-safe backdrop-blur supports-[backdrop-filter]:bg-card/80">
                {step < 3 ? (
                    <Button onClick={handleNext} disabled={!canAdvance} className="w-full rounded-xl py-6 font-semibold">Continue</Button>
                ) : (
                    <Button
                        onClick={handlePublish}
                        disabled={isPending}
                        className="w-full rounded-xl py-6 font-semibold"
                    >
                        {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Publishing...
                        </>
                        ) : (
                        "Publish Listing"
                        )}
                    </Button>
                )}
            </div>
        </div>
    )
}