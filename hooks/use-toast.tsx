"use client"

import * as React from "react"
import type { ToastActionElement, ToastProps } from "@/components/ui/toast"

/* ------------------------------------------------------------------ */
/* CONFIG */
/* ------------------------------------------------------------------ */

const TOAST_LIMIT = 1
const DEFAULT_REMOVE_DELAY = 4000
const DESTRUCTIVE_REMOVE_DELAY = 9000

/* ------------------------------------------------------------------ */
/* ICON MAP */
/* ------------------------------------------------------------------ */

const VARIANT_ICONS: Record<"default" | "destructive", React.ReactNode> = {
  default: "✅",
  destructive: "❌",
}

/* ------------------------------------------------------------------ */
/* TYPES */
/* ------------------------------------------------------------------ */

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  icon?: React.ReactNode   // ✅ NEW
}

type State = {
  toasts: ToasterToast[]
}

type Action =
  | { type: "ADD_TOAST"; toast: ToasterToast }
  | { type: "UPDATE_TOAST"; toast: Partial<ToasterToast> }
  | { type: "DISMISS_TOAST"; toastId?: string }
  | { type: "REMOVE_TOAST"; toastId?: string }

/* ------------------------------------------------------------------ */
/* STATE */
/* ------------------------------------------------------------------ */

let count = 0
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

const listeners: Array<(state: State) => void> = []
let memoryState: State = { toasts: [] }

/* ------------------------------------------------------------------ */
/* REDUCER */
/* ------------------------------------------------------------------ */

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toastId || action.toastId === undefined
            ? { ...t, open: false }
            : t
        ),
      }

    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: action.toastId
          ? state.toasts.filter((t) => t.id !== action.toastId)
          : [],
      }

    default:
      return state
  }
}

/* ------------------------------------------------------------------ */
/* DISPATCH */
/* ------------------------------------------------------------------ */

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((l) => l(memoryState))
}

/* ------------------------------------------------------------------ */
/* TOAST API */
/* ------------------------------------------------------------------ */

type Toast = Omit<ToasterToast, "id">

function toast({ variant, title, ...props }: Toast) {
  const id = genId()

  const safeVariant: "default" | "destructive" =
    variant === "destructive" ? "destructive" : "default"

  const duration =
    safeVariant === "destructive"
      ? DESTRUCTIVE_REMOVE_DELAY
      : DEFAULT_REMOVE_DELAY

  const dismiss = () => {
    dispatch({ type: "DISMISS_TOAST", toastId: id })
    setTimeout(() => {
      dispatch({ type: "REMOVE_TOAST", toastId: id })
    }, 300)
  }

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      variant: safeVariant,
      icon: VARIANT_ICONS[safeVariant], // ✅ SAFE
      title,
      open: true,
      onOpenChange: (open: boolean) => {
        if (!open) dismiss()
      },
    },
  })

  setTimeout(dismiss, duration)

  return { id, dismiss }
}

/* ------------------------------------------------------------------ */
/* HOOK */
/* ------------------------------------------------------------------ */

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const i = listeners.indexOf(setState)
      if (i > -1) listeners.splice(i, 1)
    }
  }, [])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) =>
      dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
