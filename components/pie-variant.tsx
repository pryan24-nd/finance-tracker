import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

import { formatPercentage } from "@/lib/utils";

const COLORS = ["#0062FF", "#12C6FF", "#FF647F", "#FF9354"];

type Props = {
    data: {
        name: string;
        value: number;
    }[];
};

export const PieVariant = ({ data }: Props) => {
    // Calculate total for percentage calculations
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <ResponsiveContainer width="100%" height={350}>
            <PieChart>
                <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="right"
                    iconType="circle"
                    content={({ payload }: any) => {
                        // Calculate percentage for each entry and sort by percentage (highest to lowest)
                        const sortedPayload = [...payload].map((entry: any, index: number) => {
                            // Find the corresponding data item by matching the name
                            // entry.value in legend payload is the name/label
                            const dataItem = data.find(item => item.name === entry.value) || data[index];
                            const percentage = total > 0 && dataItem ? (dataItem.value / total) * 100 : 0;
                            return { ...entry, percentage, originalIndex: index };
                        }).sort((a, b) => b.percentage - a.percentage);

                        return (
                            <ul className="flex flex-col space-y-2">
                                {sortedPayload.map((entry: any, index: number) => (
                                    <li
                                        key={`item-${entry.originalIndex}`}
                                        className="flex items-center space-x-2"
                                    >
                                        <span
                                            className="size-2 rounded-full"
                                            style={{ backgroundColor: entry.color }}
                                        />
                                        <div className="space-x-1">
                                            <span className="text-sm text-muted-foreground">
                                                {entry.value}
                                            </span>
                                            <span className="text-sm">
                                                {formatPercentage(entry.percentage)}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )
                    }}
                />
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={60}
                    paddingAngle={2}
                    fill="#8884d8"
                    dataKey="value"
                    labelLine={false}
                >
                    {data.map((_entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
};