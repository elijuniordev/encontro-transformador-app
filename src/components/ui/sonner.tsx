// src/components/ui/sonner.tsx
import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg " +
            "group-[.toast]:w-full group-[.toast]:max-w-xs sm:group-[.toast]:max-w-sm lg:group-[.toast]:max-w-md " + // Ajusta largura do toast
            "group-[.toaster]:p-4 group-[.toast]:items-center group-[.toast]:justify-center " + // Centraliza conteúdo do toast
            "group-[.toaster]:left-1/2 group-[.toaster]:-translate-x-1/2 group-[.toaster]:top-4 sm:group-[.toaster]:top-auto sm:group-[.toaster]:bottom-4", // Centraliza o toaster na tela
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }