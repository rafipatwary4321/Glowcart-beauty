import { siteConfig } from "@/constants/site-config";

type LayoutInput = {
  title: string;
  preheader?: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export function renderEmailLayout({ title, preheader, body, ctaLabel, ctaHref }: LayoutInput): string {
  const ctaBlock =
    ctaLabel && ctaHref
      ? `<p style="margin:28px 0 0;text-align:center;">
          <a href="${ctaHref}" style="display:inline-block;background:#e11d48;color:#fff;text-decoration:none;padding:12px 24px;border-radius:999px;font-weight:600;">
            ${ctaLabel}
          </a>
        </p>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body style="margin:0;padding:0;background:#faf7f5;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
    ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>` : ""}
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#faf7f5;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #f1e8e4;">
            <tr>
              <td style="padding:28px 32px;background:linear-gradient(135deg,#fff1f2,#fdf2f8);border-bottom:1px solid #fce7f3;">
                <p style="margin:0;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#e11d48;font-weight:700;">${siteConfig.name}</p>
                <h1 style="margin:8px 0 0;font-size:24px;line-height:1.3;color:#111827;">${title}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px;font-size:15px;line-height:1.7;color:#374151;">
                ${body}
                ${ctaBlock}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background:#fff7f7;border-top:1px solid #fce7f3;font-size:12px;color:#9ca3af;text-align:center;">
                © ${new Date().getFullYear()} ${siteConfig.name}. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
