import { useState } from "react";
import { SalaryData } from "../Statistics-Interfaces";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import {
  Card,
  CardContent,
  Box,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { RefreshCcw } from "lucide-react";

interface SalaryInfoCardProps {
  salary: SalaryData;
  title: string;
  onMarkAsPaid?: (salaryId: number) => Promise<void>;
  isCalculating?: boolean;
  onRecalculate?: (salaryId: number) => Promise<void>;
}

export const SalaryInfoCard: React.FC<SalaryInfoCardProps> = ({
  salary,
  title,
  onMarkAsPaid,
  isCalculating,
  onRecalculate,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePayment = async () => {
    if (!onMarkAsPaid || isUpdating || salary.is_payed) return;

    setIsUpdating(true);
    try {
      await onMarkAsPaid(salary.id);
    } catch (error) {
      console.error("Error marking salary as paid:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card elevation={3}>
      <CardContent sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="subtitle1" fontWeight="medium">
            {title}
          </Typography>
          <PaymentStatusBadge
            isPaid={salary.is_payed === 1}
            onPay={handlePayment}
            disabled={isUpdating}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              راتب الطبيب
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "medium" }}>
              {parseFloat(salary.doctor_salary).toFixed(2)} جنيه
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              عائد العيادة
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "medium" }}>
              {parseFloat(salary.clinic_salary).toFixed(2)} جنيه
            </Typography>
          </Box>
          <Box sx={{ mt: 1 }}>
            <Tooltip title="إعادة حساب">
              <IconButton
                size="small"
                onClick={() => onRecalculate?.(salary.id)}
                disabled={isCalculating}
                sx={{
                  animation: isCalculating ? "spin 1s linear infinite" : "none",
                  "@keyframes spin": {
                    "0%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(360deg)" },
                  },
                }}
              >
                <RefreshCcw size={16} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
