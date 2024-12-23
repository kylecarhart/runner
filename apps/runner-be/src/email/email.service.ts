import { Postmark } from "@runner/postmark";
import { APP_NAME, enabled } from "@runner/utils";
import { env, isDevelopment } from "../utils/env.js";
import { logger } from "../utils/logger.js";

const FROM_EMAIL = "noreply@carhart.dev";

/**
 * Send an email confirmation to the user.
 * @param email - The email address to send the confirmation to
 * @param code - The confirmation code
 * @returns The response from Postmark
 * @throws If the email fails to send
 */
export async function sendEmailConfirmation(
  email: string,
  code: string,
): Promise<void> {
  // Skip sending emails in development
  if (isDevelopment() || !enabled("EMAIL_CONFIRMATION") || !enabled("EMAIL")) {
    return logger().info("Skipping sending email confirmation...", {
      email,
      code,
    });
  }

  logger().info("Sending email confirmation", { email, code });

  const res = await Postmark.sendEmailWithTemplate({
    headers: {
      "X-Postmark-Server-Token": env().POSTMARK_SERVER_TOKEN,
    },
    body: {
      From: FROM_EMAIL,
      To: email,
      TemplateId: 38282156, // TODO: Not necessary if template alias is used, but the openapi spec is not accurate.
      TemplateAlias: "confirm-email",
      TemplateModel: {
        code,
        app_name: APP_NAME,
      },
    },
  });

  // Catch email send errors
  if (res.error) {
    logger().error("Failed to send email confirmation", {
      error: res.error,
    });
    throw res.error;
  }

  logger().info("Email confirmation sent", { email });
}
