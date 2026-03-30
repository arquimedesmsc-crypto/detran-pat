import { ReactNode } from "react";
import {
  AlertTriangle, Trash2, LogOut, ArrowRightLeft,
  CheckCircle2, XCircle, Info, ShieldAlert
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export type ConfirmVariant = "danger" | "warning" | "success" | "info" | "transfer" | "logout";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string | ReactNode;
  variant?: ConfirmVariant;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  details?: string | ReactNode;
}

const VARIANT_CONFIG: Record<ConfirmVariant, {
  icon: ReactNode;
  iconBg: string;
  confirmClass: string;
  confirmStyle?: React.CSSProperties;
  borderColor: string;
}> = {
  danger: {
    icon: <Trash2 className="w-6 h-6 text-white" />,
    iconBg: "bg-red-500",
    confirmClass: "bg-red-600 hover:bg-red-700 text-white border-0",
    borderColor: "border-red-200",
  },
  warning: {
    icon: <AlertTriangle className="w-6 h-6 text-white" />,
    iconBg: "bg-amber-500",
    confirmClass: "bg-amber-600 hover:bg-amber-700 text-white border-0",
    borderColor: "border-amber-200",
  },
  success: {
    icon: <CheckCircle2 className="w-6 h-6 text-white" />,
    iconBg: "bg-green-500",
    confirmClass: "",
    confirmStyle: { background: "linear-gradient(135deg, #1B8A5A, #2E9D6A)", color: "white" },
    borderColor: "border-green-200",
  },
  info: {
    icon: <Info className="w-6 h-6 text-white" />,
    iconBg: "bg-blue-500",
    confirmClass: "",
    confirmStyle: { background: "linear-gradient(135deg, #1B4F72, #1A73C4)", color: "white" },
    borderColor: "border-blue-200",
  },
  transfer: {
    icon: <ArrowRightLeft className="w-6 h-6 text-white" />,
    iconBg: "",
    confirmClass: "",
    confirmStyle: { background: "linear-gradient(135deg, #1B4F72, #1A73C4, #1B8A5A)", color: "white" },
    borderColor: "border-blue-200",
  },
  logout: {
    icon: <LogOut className="w-6 h-6 text-white" />,
    iconBg: "bg-slate-600",
    confirmClass: "bg-slate-700 hover:bg-slate-800 text-white border-0",
    borderColor: "border-slate-200",
  },
};

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  variant = "warning",
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  loading = false,
  details,
}: ConfirmDialogProps) {
  const config = VARIANT_CONFIG[variant];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${config.iconBg}`}
              style={
                variant === "transfer"
                  ? { background: "linear-gradient(135deg, #1B4F72, #1A73C4, #1B8A5A)" }
                  : undefined
              }
            >
              {config.icon}
            </div>
            <div className="flex-1 pt-1">
              <DialogTitle className="text-lg font-semibold leading-tight">{title}</DialogTitle>
              <DialogDescription className="mt-1 text-sm text-muted-foreground">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {details && (
          <div className={`rounded-lg border p-3 bg-muted/30 ${config.borderColor}`}>
            <div className="text-sm text-foreground/80">{details}</div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="flex-1 sm:flex-none"
          >
            <XCircle className="w-4 h-4 mr-2" />
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 sm:flex-none gap-2 ${config.confirmClass}`}
            style={config.confirmStyle}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              config.icon
            )}
            {loading ? "Processando..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Hook utilitário para uso fácil
import { useState, useCallback } from "react";

export function useConfirmDialog() {
  const [state, setState] = useState<{
    open: boolean;
    title: string;
    description: string | ReactNode;
    variant: ConfirmVariant;
    confirmLabel: string;
    cancelLabel: string;
    details?: string | ReactNode;
    onConfirm: () => void;
  }>({
    open: false,
    title: "",
    description: "",
    variant: "warning",
    confirmLabel: "Confirmar",
    cancelLabel: "Cancelar",
    onConfirm: () => {},
  });

  const confirm = useCallback((opts: {
    title: string;
    description: string | ReactNode;
    variant?: ConfirmVariant;
    confirmLabel?: string;
    cancelLabel?: string;
    details?: string | ReactNode;
    onConfirm: () => void;
  }) => {
    setState({
      open: true,
      title: opts.title,
      description: opts.description,
      variant: opts.variant ?? "warning",
      confirmLabel: opts.confirmLabel ?? "Confirmar",
      cancelLabel: opts.cancelLabel ?? "Cancelar",
      details: opts.details,
      onConfirm: opts.onConfirm,
    });
  }, []);

  const close = useCallback(() => {
    setState(prev => ({ ...prev, open: false }));
  }, []);

  const dialog = (
    <ConfirmDialog
      open={state.open}
      onOpenChange={(open) => !open && close()}
      onConfirm={() => {
        state.onConfirm();
        close();
      }}
      title={state.title}
      description={state.description}
      variant={state.variant}
      confirmLabel={state.confirmLabel}
      cancelLabel={state.cancelLabel}
      details={state.details}
    />
  );

  return { confirm, close, dialog };
}
