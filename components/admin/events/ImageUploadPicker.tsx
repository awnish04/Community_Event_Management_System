"use client"

import { useRef, useState } from "react"
import { ImageIcon, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageUploadPickerProps {
  /** Pre-existing image URL (e.g. when editing an event) */
  defaultValue?: string | null
  label?: string
  /** Called when a file has been successfully uploaded with its public URL */
  onUploadComplete?: (url: string) => void
  /** Called when the image is removed */
  onRemove?: () => void
  /** Called when an upload starts (so parent can disable submit) */
  onUploadStart?: () => void
  /** Called when an upload finishes (success or error) */
  onUploadEnd?: () => void
}

/**
 * File-based image picker.
 *
 * On file selection the image is immediately POSTed to /api/upload which
 * saves it to /public/uploads/ and returns a public URL string.
 * The URL is surfaced to the parent via onUploadComplete so the parent
 * can store it in state and append it to FormData manually — this avoids
 * React's hidden-input value-vs-attribute discrepancy with FormData reads.
 */
export function ImageUploadPicker({
  defaultValue,
  label = "Event image",
  onUploadComplete,
  onRemove,
  onUploadStart,
  onUploadEnd,
}: ImageUploadPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(defaultValue || null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setUploadError(null)

    // Instant local preview
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target?.result as string)
    reader.readAsDataURL(file)

    // Upload to server
    setUploading(true)
    onUploadStart?.()
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Upload failed")
      onUploadComplete?.(data.url)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed"
      setUploadError(msg)
      setPreview(null)
    } finally {
      setUploading(false)
      onUploadEnd?.()
    }
  }

  function handleRemove() {
    setPreview(null)
    setFileName(null)
    setUploadError(null)
    onRemove?.()
    if (inputRef.current) inputRef.current.value = ""
  }

  const displayName =
    fileName ??
    (defaultValue ? defaultValue.split("/").pop() ?? "image" : null)

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium leading-none">
        {label}
      </label>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      {/* Picker row */}
      <div className="flex items-center gap-3">
        {/* Thumbnail / placeholder */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Event preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
          )}
        </div>

        {/* Upload / Change button */}
        <Button
          type="button"
          variant="default"
          size="sm"
          className="gap-2 px-4"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Uploading…
            </>
          ) : preview ? (
            "Change image"
          ) : (
            "Upload image"
          )}
        </Button>
      </div>

      {/* Status row */}
      <div className="flex items-center gap-2 text-xs">
        {uploadError ? (
          <span className="text-destructive">{uploadError}</span>
        ) : displayName ? (
          <>
            <span className="truncate max-w-[180px] text-muted-foreground">
              {displayName}
            </span>
            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-0.5 text-destructive hover:underline"
            >
              <X className="h-3 w-3" />
              Remove
            </button>
          </>
        ) : (
          <span className="text-muted-foreground">No image attached</span>
        )}
      </div>
    </div>
  )
}
