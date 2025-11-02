"use server";

import { transporter } from "@/lib/nodemailer";

const styles = {
  container: "max-width:500px;margin:20px auto;padding:20px;border:1px solid #ddd;border-radius:6px;",
  header: "font-size:20px;color:#333;",
  paragraph: "font-size:16px;",
  link: "display:inline-block;margin-top:16px;padding:10px 16px;background:#007bff;color:#fff;text-decoration:none;border-radius:4px;",
}

export const sendEmail = async ({
  to,
  subject,
  description,
  url,
}: {
  to: string,
  subject: string,
  description: string,
  url: string,
}) => {
  await transporter.sendMail({
    from: process.env.NODEMAILER_USER,
    to,
    subject,
    html: `
      <div style="${styles.container}">
        <h1 style="${styles.header}">${subject}</h1>
        <p style="${styles.paragraph}">${description}</p>
        <a href="${url}" style="${styles.link}">
          View
        </a>
      </div>
    `,
  })
}