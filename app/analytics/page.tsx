// "use client";

// import { Card, CardContent } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";

// export default function DealerSalesProgress({
//   sales,
// }: {
//   sales: { car: string; sold: number; target: number; revenue: number }[];
// }) {
//   const totalSold = sales?.reduce((acc, s) => acc + s.sold, 0);
//   const totalRevenue = sales?.reduce((acc, s) => acc + s.revenue, 0);

//   return (
//     <Card className="p-6">
//       <h3 className="text-xl font-semibold mb-4">Sales Progress</h3>

//       {/* Summary */}
//       <div className="flex justify-between mb-6">
//         <div>
//           <p className="text-sm text-muted-foreground">Total Cars Sold</p>
//           <p className="text-2xl font-bold">{totalSold}</p>
//         </div>
//         <div>
//           <p className="text-sm text-muted-foreground">Total Revenue</p>
//           <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
//         </div>
//       </div>

//       {/* Per-car Progress */}
//       <div className="space-y-4">
//         {sales.map((s, idx) => (
//           <div key={idx}>
//             <div className="flex justify-between text-sm mb-1">
//               <span>{s.car}</span>
//               <span>
//                 {s.sold}/{s.target} cars
//               </span>
//             </div>
//             <Progress value={(s.sold / s.target) * 100} className="h-2" />
//           </div>
//         ))}
//       </div>
//     </Card>
//   );
// }
