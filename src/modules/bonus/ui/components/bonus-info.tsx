// import { UserAvatar } from "@/modules/auth/ui/components/user-avatar";
// import { KpiEvalucationWithInfo } from "@/types/kpi";
// import { BsPeopleFill } from "react-icons/bs";

// interface Props {
//   record?: KpiEvalucationWithInfo;
// }

// export const BonusInfo = ({ record }: Props) => {
//   return (
//     <div className="w-full max-w-full mx-auto ps-24 sticky start-0 pb-3 mb-3 -ms-1">
//       <div className="flex flex-row gap-2">
//         <div className="grid [grid-template-columns:repeat(auto-fit,minmax(80px,max-content))] gap-y-2 gap-x-1 mt-2.5 max-w-full">
//           <div className="flex flex-col">
//             <div className="flex flex-row">
//               <div className="flex items-center text-tertiary h-6 w-min max-w-full min-w-0">
//                 <div role="cell" className="select-none transition cursor-pointer flex items-center h-full w-full rounded px-1.5 max-w-full hover:bg-primary/6">
//                   <div className="flex items-center leading-[18px] text-xs font-medium">
//                     <div className="flex items-center justify-center h-6 w-5">
//                       <BsPeopleFill className="size-3" />
//                     </div>
//                     <div className="whitespace-nowrap overflow-hidden text-ellipsis">
//                       Prepare by
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="select-none transition relative text-sm overflow-hidden items-center rounded hover:bg-primary/6 w-full min-h-[30px] py-1 px-1.5 flex">
//               <div className="shrink-0 grow-0 me-1.5 mt-0">
//                 <UserAvatar 
//                   name={record?.kpiEvaluations[0].approval.preparer.fullName || ""}
//                   className={{
//                     container: "size-5",
//                     fallback: "text-xs font-normal"
//                   }}
//                 />
//               </div>
//               <div className="text-primary leading-[1.5] break-words whitespace-nowrap text-ellipsis overflow-hidden">
//                 {record?.kpiEvaluations[0].approval.preparer.fullName}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }