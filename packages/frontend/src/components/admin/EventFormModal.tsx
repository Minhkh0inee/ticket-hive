import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { createEventRequest, updateEventRequest } from '@/stores/slices/admin.slice'
import { type Event, EventStatus } from '@/types/event.types'

const schema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  eventDate: z.string().min(1, 'Event date is required'),
  venue: z.string().min(2, 'Venue is required'),
  city: z.string().min(2, 'City is required'),
  basePrice: z.coerce.number().min(0, 'Price must be 0 or more'),
  totalSeats: z.coerce.number().int().min(1, 'Must have at least 1 seat'),
  tag: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  imageUrl: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
  status: z.nativeEnum(EventStatus).optional(),
})

type EventFormValues = z.infer<typeof schema>

const STATUS_LABELS: Record<EventStatus, string> = {
  [EventStatus.UPCOMING]: 'Upcoming',
  [EventStatus.ONGOING]: 'Ongoing',
  [EventStatus.SOLD_OUT]: 'Sold Out',
  [EventStatus.ENDED]: 'Ended',
  [EventStatus.CANCELLED]: 'Cancelled',
}

interface EventFormModalProps {
  open: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  event?: Event | null
}

export function EventFormModal({ open, onClose, mode, event }: EventFormModalProps) {
  const dispatch = useAppDispatch()
  const { isSubmitting, submitError } = useAppSelector((s) => s.admin)
  const categories = useAppSelector((s) => s.category.categories)

  const wasSubmittingRef = useRef(false)

  const form = useForm<EventFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      eventDate: '',
      venue: '',
      city: '',
      basePrice: 0,
      totalSeats: 100,
      tag: '',
      categoryId: '',
      imageUrl: '',
    },
  })

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && event) {
      form.reset({
        title: event.title,
        description: event.description,
        eventDate: event.eventDate.slice(0, 16),
        venue: event.venue,
        city: event.city,
        basePrice: event.basePrice,
        totalSeats: event.totalSeats,
        categoryId: event.category.id,
        imageUrl: event.bannerUrl ?? '',
        tag: '',
        status: event.status,
      })
    } else {
      form.reset({
        title: '',
        description: '',
        eventDate: '',
        venue: '',
        city: '',
        basePrice: 0,
        totalSeats: 100,
        tag: '',
        categoryId: '',
        imageUrl: '',
      })
    }
  }, [open, mode, event, form])

  useEffect(() => {
    if (wasSubmittingRef.current && !isSubmitting && !submitError) {
      onClose()
    }
    wasSubmittingRef.current = isSubmitting
  }, [isSubmitting, submitError, onClose])

  function onSubmit(values: EventFormValues) {
    if (mode === 'create') {
      const { status: _status, ...dto } = values
      dispatch(
        createEventRequest({
          ...dto,
          imageUrl: dto.imageUrl || undefined,
          tag: dto.tag || undefined,
        }),
      )
    } else if (event) {
      dispatch(
        updateEventRequest({
          id: event.id,
          dto: {
            ...values,
            imageUrl: values.imageUrl || undefined,
            tag: values.tag || undefined,
          },
        }),
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl bg-[oklch(0.16_0_0)] border-[oklch(0.24_0_0)] text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">
            {mode === 'create' ? 'Create Event' : 'Edit Event'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[oklch(0.75_0_0)]">Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-[oklch(0.11_0_0)] border-[oklch(0.28_0_0)] text-white placeholder:text-[oklch(0.4_0_0)]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[oklch(0.75_0_0)]">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={3}
                      className="bg-[oklch(0.11_0_0)] border-[oklch(0.28_0_0)] text-white placeholder:text-[oklch(0.4_0_0)] resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Event Date */}
            <FormField
              control={form.control}
              name="eventDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[oklch(0.75_0_0)]">Event Date</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="datetime-local"
                      className="bg-[oklch(0.11_0_0)] border-[oklch(0.28_0_0)] text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Venue + City */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="venue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[oklch(0.75_0_0)]">Venue</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-[oklch(0.11_0_0)] border-[oklch(0.28_0_0)] text-white placeholder:text-[oklch(0.4_0_0)]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[oklch(0.75_0_0)]">City</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-[oklch(0.11_0_0)] border-[oklch(0.28_0_0)] text-white placeholder:text-[oklch(0.4_0_0)]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Base Price + Total Seats */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="basePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[oklch(0.75_0_0)]">Base Price (₫)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        className="bg-[oklch(0.11_0_0)] border-[oklch(0.28_0_0)] text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalSeats"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[oklch(0.75_0_0)]">Total Seats</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={1}
                        className="bg-[oklch(0.11_0_0)] border-[oklch(0.28_0_0)] text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Category */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[oklch(0.75_0_0)]">Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-[oklch(0.11_0_0)] border-[oklch(0.28_0_0)] text-white">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[oklch(0.16_0_0)] border-[oklch(0.28_0_0)]">
                      {categories.map((cat) => (
                        <SelectItem
                          key={cat.id}
                          value={cat.id}
                          className="text-white focus:bg-[oklch(0.22_0_0)] focus:text-white"
                        >
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tag + Image URL */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[oklch(0.75_0_0)]">Tag (optional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. featured"
                        className="bg-[oklch(0.11_0_0)] border-[oklch(0.28_0_0)] text-white placeholder:text-[oklch(0.4_0_0)]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[oklch(0.75_0_0)]">Image URL (optional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="https://..."
                        className="bg-[oklch(0.11_0_0)] border-[oklch(0.28_0_0)] text-white placeholder:text-[oklch(0.4_0_0)]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Status — edit only */}
            {mode === 'edit' && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[oklch(0.75_0_0)]">Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-[oklch(0.11_0_0)] border-[oklch(0.28_0_0)] text-white">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[oklch(0.16_0_0)] border-[oklch(0.28_0_0)]">
                        {Object.values(EventStatus).map((s) => (
                          <SelectItem
                            key={s}
                            value={s}
                            className="text-white focus:bg-[oklch(0.22_0_0)] focus:text-white"
                          >
                            {STATUS_LABELS[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {submitError && (
              <p className="text-sm text-red-400">{submitError}</p>
            )}

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-[oklch(0.28_0_0)] text-[oklch(0.75_0_0)] hover:bg-[oklch(0.22_0_0)] hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="text-white gap-2"
                style={{ background: 'oklch(0.6 0.2 250)' }}
              >
                {isSubmitting && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {mode === 'create' ? 'Create Event' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
