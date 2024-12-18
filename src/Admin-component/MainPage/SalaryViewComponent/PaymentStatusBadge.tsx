import React from "react";
import { Chip, Tooltip, Box } from "@mui/material";
import { CheckCircle, XCircle } from "lucide-react";

interface PaymentStatusBadgeProps {
  isPaid: boolean;
  onPay?: () => void;
  disabled?: boolean;
}

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({
  isPaid,
  onPay,
  disabled = false,
}) => (
  <Tooltip title={!isPaid && onPay ? "انقر للتأكيد الدفع" : undefined}>
    <Box sx={{ display: "inline-block" }}>
      <Chip
        icon={isPaid ? <CheckCircle size={16} /> : <XCircle size={16} />}
        label={isPaid ? "تم الدفع" : "لم يتم الدفع"}
        color={isPaid ? "success" : "error"}
        variant="outlined"
        onClick={!isPaid && !disabled ? onPay : undefined}
        sx={{
          cursor: !isPaid && !disabled ? "pointer" : "default",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: !isPaid && !disabled ? "translateY(-1px)" : "none",
            boxShadow: !isPaid && !disabled ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
          },
        }}
      />
    </Box>
  </Tooltip>
);