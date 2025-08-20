import { prisma } from "@/lib/prisma";

export const seedCompetencies = async () => {
  await prisma.competency.createMany({
    data: [
      {
        id: "FC4G",
        name: "หุ้นส่วนเชิงธุรกิจ HR",
        definition: "ความสามารถในการเป็นที่ปรึกษาเชิงกลยุทธ์ด้านทรัพยากรบุคคลให้กับธุรกิจ",
        type: "FC",
      },
      {
        id: "MC3",
        name: "การวางแผนและการดำเนินกลยุทธ์",
        definition: "ความสามารถในการกำหนด วางแผน และดำเนินกลยุทธ์อย่างมีประสิทธิภาพ",
        type: "MC",
      },
      {
        id: "DAAI",
        name: "ดิจิทัลและ AI",
        definition: "ความสามารถในการใช้เครื่องมือดิจิทัลและปัญญาประดิษฐ์เพื่อยกระดับกระบวนการ",
        type: "TC",
      },
      {
        id: "MD",
        name: "แดชบอร์ดการติดตาม",
        definition: "ความสามารถในการพัฒนาและใช้แดชบอร์ดเพื่อวิเคราะห์ข้อมูล",
        type: "CC",
      },
    ],
  })
}