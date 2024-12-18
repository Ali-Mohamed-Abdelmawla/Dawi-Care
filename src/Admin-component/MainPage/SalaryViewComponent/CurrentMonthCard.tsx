// CurrentMonthCard.tsx
import { useState } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { SalaryData } from "../Statistics-Interfaces";
import { PaymentStatusBadge } from "./PaymentStatusBadge";

interface CurrentMonthCardProps {
  currentMonthSalary: SalaryData;
  previousSalary: SalaryData | null;
  salaryChangePercentage: number;
  personType: string;
  onMarkAsPaid?: (salaryId: number) => Promise<void>;
}

export const CurrentMonthCard: React.FC<CurrentMonthCardProps> = ({
  currentMonthSalary,
  previousSalary,
  salaryChangePercentage,
  personType,
  onMarkAsPaid,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePayment = async () => {
    if (!onMarkAsPaid || isUpdating || currentMonthSalary.is_payed) return;

    setIsUpdating(true);
    try {
      await onMarkAsPaid(currentMonthSalary.id);
    } catch (error) {
      console.error("Error marking salary as paid:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography color="text.secondary" gutterBottom>
            {/* عائد كشوفات الطبيب الي الاّن */}
            {personType === "employee"
              ? "عائد الموظف الي الاّن"
              : "عائد كشوفات الطبيب الي الاّن"}
          </Typography>
          {personType === "employee" && (
            <PaymentStatusBadge
              isPaid={currentMonthSalary.is_payed === 1}
              onPay={handlePayment}
              disabled={isUpdating}
            />
          )}
        </Box>

        {currentMonthSalary ? (
          <>
            <Typography variant="h4" sx={{ mb: 2 }}>
              {parseFloat(currentMonthSalary.total_salary).toFixed(2)} جنيه
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              الأيام التي عملها{" "}
              {personType === "employee" ? "الموظف" : "الطبيب"}:{" "}
              {currentMonthSalary.num_worked_days}
            </Typography>
            {previousSalary && (
              <Typography
                variant="body2"
                color={
                  salaryChangePercentage >= 0 ? "success.main" : "error.main"
                }
                sx={{ mt: 1 }}
              >
                {salaryChangePercentage >= 0 ? "↑" : "↓"}{" "}
                {Math.abs(salaryChangePercentage).toFixed(1)}% عن الشهر السابق
              </Typography>
            )}
          </>
        ) : (
          <Typography variant="body1" color="text.secondary">
            لا يوجد راتب مسجل للشهر الحالي
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
