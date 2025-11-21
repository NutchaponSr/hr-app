"use server";

import { transporter } from "@/lib/nodemailer";
import { format } from "date-fns";

export const sendApproved = async ({
  to,
  cc,
  subject,
  checkerName,
  approverName,
  employeeName,
  documentType,
  checkedAt,
  approvedAt,
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
  approvedAt?: string,
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
          <p style="margin: 20px 0; font-size: 16px; color: #e0e0e0;">เรียน คุณ${employeeName},</p>

          <!-- Body -->
          <p style="margin: 20px 0; font-size: 16px; color: #e0e0e0; line-height: 1.6;">
            ขอแจ้งให้ทราบว่าเอกสาร ${documentType} ของท่าน ได้รับการอนุมัติครบทุกขั้นตอนเรียบร้อยแล้ว
          </p>

          <!-- Details Table -->
          <div style="margin: 30px 0; background-color: #3a3a3a; border-radius: 8px; padding: 20px;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr>
                  <th style="text-align: left; padding: 10px; color: #e0e0e0; font-weight: bold; border-bottom: 1px solid #555;">สถานะ (Status)</th>
                  <th style="text-align: left; padding: 10px; color: #e0e0e0; font-weight: bold; border-bottom: 1px solid #555;">ผู้ดำเนินการ (Action By)</th>
                  <th style="text-align: left; padding: 10px; color: #e0e0e0; font-weight: bold; border-bottom: 1px solid #555;">วันที่ (Date)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 12px 10px; color: #e0e0e0; font-weight: bold; border-bottom: 1px solid #555;">Checked</td>
                  <td style="padding: 12px 10px; color: #e0e0e0; border-bottom: 1px solid #555;">${checkerName || `-`}</td>
                  <td style="padding: 12px 10px; color: #e0e0e0; border-bottom: 1px solid #555;">${checkedAt || `-`}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 10px; color: #e0e0e0; font-weight: bold; border-bottom: 1px solid #555;">Approved</td>
                  <td style="padding: 12px 10px; color: #e0e0e0; border-bottom: 1px solid #555;">${approverName}</td>
                  <td style="padding: 12px 10px; color: #e0e0e0; border-bottom: 1px solid #555;">${approvedAt || `-`}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 10px; color: #e0e0e0; font-weight: bold; border-bottom: 1px solid #555;">Current Status</td>
                  <td style="padding: 12px 10px; color: #e0e0e0; border-bottom: 1px solid #555;">Completed</td>
                  <td style="padding: 12px 10px; color: #e0e0e0; border-bottom: 1px solid #555;">${format(new Date(), "yyyy-MM-dd")}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Call to Action -->
          <p style="margin: 30px 0 20px 0; font-size: 16px; color: #e0e0e0; line-height: 1.6;">
            ท่านสามารถเข้าไปดูรายละเอียดผลการอนุมัติได้ที่ปุ่มด้านล่าง
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