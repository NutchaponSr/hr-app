import { CompetencyType } from "@/generated/prisma";

export const competencyTypes: Record<CompetencyType, string> = {
  [CompetencyType.CC]: "Core",
  [CompetencyType.MC]: "Managerial",
  [CompetencyType.FC]: "Functional",
  [CompetencyType.TC]: "Technical",
}

export const competencyLevels = [
  {
    label: "Level 1",
    content: "สามารถทำ/แสดงออก/ได้ผลลัพธ์ที่คาดหวังน้อยกว่า 60%",
  },
  {
    label: "Level 2",
    content: "สามารถทำ/แสดงออก/ได้ผลลัพธ์ที่คาดหวัง 60% - 69%",
  },
  {
    label: "Level 3",
    content: "สามารถทำ/แสดงออก/ได้ผลลัพธ์ที่คาดหวัง 70% - 79%",
  },
  {
    label: "Level 4",
    content: "สามารถทำ/แสดงออก/ได้ผลลัพธ์ที่คาดหวัง 80% - 89%",
  },
  {
    label: "Level 5",
    content: "สามารถทำ/แสดงออก/ได้ผลลัพธ์ที่คาดหวัง 90% ขึ้นไป",
  },
];

export const cultureLevels = [
  {
    label: "Level 1",
    content: "เข้าใจความหมายและอธิบาย Culture ข้อนั้นๆได้",
  },
  {
    label: "Level 2",
    content: "เริ่ม/ทดลองปฏิบัติ แสดงออกตามพฤติกรรมที่คาดหวังของ Culture ข้อนั้นๆ",
  },
  {
    label: "Level 3",
    content: "ปฏิบัติตาม/แสดงออกพฤติกรรมที่คาดหวังของ Culture ข้อนั้นๆอยู่เสมอ",
  },
  {
    label: "Level 4",
    content: "ชักชวนพนักงานคนอื่นปฏิบัติตามพฤติกรรมที่คาดหวังของ Culture ข้อนั้นๆ",
  },
  {
    label: "Level 5",
    content: "เป็นแบบอย่างให้พนักงานคนอื่นปฏิบัติตามพฤติกรรมที่คาดหวังของ Culture ข้อนั้นๆ",
  },
];