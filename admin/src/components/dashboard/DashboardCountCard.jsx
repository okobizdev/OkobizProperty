import { Card } from "antd";
import { ReactNode } from "react";

// interface DashboardCountCardProps {
//   value: number | string;
//   label: string;
//   bgColor?: string;
//   icon?: ReactNode;
// }

const DashboardCountCard = ({ value, label, bgColor = "#f0f2f5", icon }) => {
  return (
    <div
      style={{
        background: bgColor,
        // textAlign: "center",
        // borderRadius: 10,
        // boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
      className="flex justify-between items-center p-10 px-20 rounded shadow-md"
    >
      <div className="text-4xl">{icon}</div>
      <div>
        <h2 className="text-2xl text-right">{value}</h2>
        <p className="text-xl">{label}</p>
      </div>
    </div>
  );
};

export default DashboardCountCard;
