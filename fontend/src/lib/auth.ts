import { Polar } from "@polar-sh/sdk";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../../generated/prisma";
import { env } from "~/env";
import {
  checkout,
  polar,
  portal,
  usage,
  webhooks,
} from "@polar-sh/better-auth";
const polarClient = new Polar({
  accessToken: env.POLAR_ACCESS_TOKEN,
  server: "sandbox",
});
const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "5474a4c5-0da3-411e-865e-e782f6a408cc",
              slug: "large",
            },
            {
              productId: "48ea8521-30a2-49a6-a2db-6a20c396a228",
              slug: "medium",
            },
            {
              productId: "7ddc4b4f-476e-4c73-9740-49dccdc4371f",
              slug: "small",
            },
          ],
          successUrl: "/dashboard",
          authenticatedUsersOnly: true,
        }),
        portal(),
        usage(),
        webhooks({
          secret: env.POLAR_WEBHOOK_SECRET,
          onCustomerStateChanged: async (payload) => {
            const externalCustomerId = payload.data.externalId;
            if (!externalCustomerId) {
              console.error("No external customer ID found");
              throw new Error("No external customerId found");
            }
            // TODO: Xử lý khi customer state thay đổi
            // Ví dụ: Update credits, subscription status, etc.
          },
          onPayload: async (payload) => {
            // Xử lý payment success event để cộng credits
            // Kiểm tra các event types có thể liên quan đến payment success
            const paymentEventTypes = [
              "checkout.succeeded",
              "checkout.completed",
              "payment.succeeded",
              "checkout.created",
            ];

            const eventType = payload.type as string;
            if (paymentEventTypes.includes(eventType)) {
              try {
                // Log để debug event structure
                console.log("Payment event received:", eventType);

                // Thử lấy thông tin từ các cấu trúc payload khác nhau
                const payloadData = payload as unknown as {
                  data?: {
                    customer?: { externalId?: string };
                    externalId?: string;
                    product?: { id?: string };
                    productId?: string;
                  };
                  customer?: { externalId?: string };
                  product?: { id?: string };
                };

                const externalCustomerId: string | undefined =
                  payloadData.data?.customer?.externalId ??
                  payloadData.data?.externalId ??
                  payloadData.customer?.externalId;

                const productId: string | undefined =
                  payloadData.data?.product?.id ??
                  payloadData.data?.productId ??
                  payloadData.product?.id;

                if (!externalCustomerId || !productId) {
                  console.error(
                    "Missing externalCustomerId or productId in payment event",
                    { eventType, externalCustomerId, productId },
                  );
                  return;
                }

                // Tìm user từ externalCustomerId (externalId được lưu trong Account table)
                const account = await prisma.account.findFirst({
                  where: {
                    accountId: externalCustomerId,
                    providerId: "polar",
                  },
                  include: {
                    user: true,
                  },
                });

                if (!account || !account.user) {
                  console.error(
                    `User not found for externalCustomerId: ${externalCustomerId}`,
                  );
                  return;
                }

                // Xác định số credits tương ứng với từng product
                let creditsToAdd = 0;
                switch (productId) {
                  case "5474a4c5-0da3-411e-865e-e782f6a408cc": // large
                    creditsToAdd = 400;
                    break;
                  case "48ea8521-30a2-49a6-a2db-6a20c396a228": // medium
                    creditsToAdd = 200;
                    break;
                  case "7ddc4b4f-476e-4c73-9740-49dccdc4371f": // small
                    creditsToAdd = 50;
                    break;
                  default:
                    console.warn(`Unknown productId: ${productId}`);
                    return;
                }

                // Cập nhật credits cho user
                await prisma.user.update({
                  where: {
                    id: account.user.id,
                  },
                  data: {
                    credits: {
                      increment: creditsToAdd,
                    },
                  },
                });

                console.log(
                  `Added ${creditsToAdd} credits to user ${account.user.id} for product ${productId}`,
                );
              } catch (error) {
                console.error("Error processing payment webhook:", error);
              }
            }
            // Catch-all handler cho tất cả webhook events khác
            // Có thể log, track, hoặc xử lý các events khác
          },
        }),
      ],
    }),
  ],
});
