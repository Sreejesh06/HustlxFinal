import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface AnalyticsCardProps {
  title: string;
  value: string;
  description?: string;
  icon?: React.ReactNode;
  trend?: number;
}

const AnalyticsCard = ({ title, value, description, icon, trend }: AnalyticsCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline mt-1">
              <h4 className="text-2xl font-bold">{value}</h4>
              {trend !== undefined && (
                <span className={`ml-1.5 inline-flex items-center text-xs font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trend >= 0 ? (
                    <>
                      <TrendingUp className="h-3 w-3 mr-0.5" />
                      +{trend}%
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-3 w-3 mr-0.5" />
                      {trend}%
                    </>
                  )}
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          {icon && (
            <div className="rounded-full bg-muted p-2 w-8 h-8 flex items-center justify-center">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsCard;
