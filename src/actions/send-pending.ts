"use server";

import { transporter } from "@/lib/nodemailer";

export const sendPending = async ({
  to,
  cc,
  subject,
  employeeName,
  checkerName,
  approverName,
  documentType,
  checkedAt,
  status,
  url,
}: {
  to: string,
  cc?: string[],
  subject: string,
  checkerName?: string,
  approverName: string,
  employeeName: string,
  documentType: string,
  checkedAt?: string,
  status: string,
  url: string,
}) => {
  await transporter.sendMail({
    from: process.env.NODEMAILER_USER,
    to,
    cc: cc || undefined,
    subject,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #2c2c2c; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #2c2c2c; color: #e0e0e0;">
          <!-- Header -->
          <div style="margin-bottom: 20px;">
            <p style="margin: 5px 0; color: #e0e0e0; font-size: 14px;">To: ${to}</p>
            ${cc ? `<p style="margin: 5px 0; color: #e0e0e0; font-size: 14px;">CC: ${cc.join(', ')} (เพื่อยืนยันว่าส่งแล้ว)</p>` : ''}
            <p style="margin: 5px 0; color: #e0e0e0; font-size: 14px;"><strong>Subject: ${subject}</strong></p>
          </div>

          <!-- Salutation -->
          <p style="margin: 20px 0; font-size: 16px; color: #e0e0e0;">เรียน คุณ${approverName},</p>

          <!-- Body -->
          <p style="margin: 20px 0; font-size: 16px; color: #e0e0e0; line-height: 1.6;">
            มีเอกสารจากระบบประเมินผลการปฏิบัติงาน เข้ามาในระบบเพื่อรอการตรวจสอบและพิจารณาอนุมัติขั้นสุดท้ายจากท่าน (ผ่านการตรวจสอบแล้ว) โดยมีรายละเอียดดังนี้:
          </p>

          <!-- Details Table -->
          <div style="margin: 30px 0; background-color: #3a3a3a; border-radius: 8px; padding: 20px;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr>
                  <th style="text-align: left; padding: 10px; color: #e0e0e0; font-weight: bold; border-bottom: 1px solid #555;">รายละเอียด (Details)</th>
                  <th style="text-align: left; padding: 10px; color: #e0e0e0; font-weight: bold; border-bottom: 1px solid #555;">ข้อมูล (Information)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 12px 10px; color: #e0e0e0; font-weight: bold; border-bottom: 1px solid #555;">ชื่อพนักงาน (Employee):</td>
                  <td style="padding: 12px 10px; color: #e0e0e0; border-bottom: 1px solid #555;">${employeeName}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 10px; color: #e0e0e0; font-weight: bold; border-bottom: 1px solid #555;">ประเภทเอกสาร (Document):</td>
                  <td style="padding: 12px 10px; color: #e0e0e0; border-bottom: 1px solid #555;">${documentType}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 10px; color: #e0e0e0; font-weight: bold; border-bottom: 1px solid #555;">ผู้ตรวจสอบ (Checked By):</td>
                  <td style="padding: 12px 10px; color: #e0e0e0; border-bottom: 1px solid #555;">${checkerName}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 10px; color: #e0e0e0; font-weight: bold; border-bottom: 1px solid #555;">สถานะ (Status):</td>
                  <td style="padding: 12px 10px; color: #e0e0e0; border-bottom: 1px solid #555;">${status}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 10px; color: #e0e0e0; font-weight: bold; border-bottom: 1px solid #555;">วันที่ส่ง (Submitted Date):</td>
                  <td style="padding: 12px 10px; color: #e0e0e0; border-bottom: 1px solid #555;">${checkedAt}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Call to Action -->
          <p style="margin: 30px 0 20px 0; font-size: 16px; color: #e0e0e0; line-height: 1.6;">
            กรุณาคลิกปุ่มด้านล่างเพื่อเข้าสู่ระบบเพื่อตรวจสอบและพิจารณา
          </p>

          <!-- Button -->
          <div style="text-align: start; margin: 30px 0;">
            <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">
              ดูรายละเอียด (View Details)
            </a>
          </div>
        </div>
      </body>
      </html>
    `,
  })
}