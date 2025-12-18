import { scrapeProduct } from "@/lib/firecrawl";
import { sendmail } from "@/lib/sendmail";
import { createClient } from "@supabase/supabase-js";
import { Currency } from "lucide-react";
import { NextResponse } from "next/server";

// export async function GET(params) {
//   return NextResponse.json({ message: "working" });
// }

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KAY
    );

    const { data: products, error } = await supabase
      .from("products")
      .select("*");

    if (error) throw error;

    const result = {
      total: products.length,
      updated: 0,
      failed: 0,
      priceChanges: 0,
      alertsSent: 0,
    };

    for (const product of products) {
      try {
        const productData = await scrapeProduct(product.url);

        if (!productData.currentPrice) {
          result.failed++;
          continue;
        }

        const newPrice = parseFloat(productData.currentPrice);
        const oldPrice = parseFloat(product.current_price);

        console.log(newPrice, oldPrice);

        await supabase
          .from("products")
          .update({
            current_price: newPrice,
            currency: productData.currencyCode || product.currency,
            name: productData.productName || product.name,
            image_url: productData.productImageUrl || product.image_url,
            updated_at: new Date().toISOString(),
          })
          .eq("id", product.id);

        if (oldPrice !== newPrice) {
          await supabase.from("price_history").insert({
            product_id: product.id,
            price: newPrice,
            currency: productData.currencyCode || product.currency,
          });

          result.priceChanges++;

          if (newPrice < oldPrice) {
            const {
              data: { user },
            } = await supabase.auth.admin.getUserById(product.user_id);

            console.log(user.email);
            console.log(product);
            
            

            if (user?.email) {
              const emailResult = await sendmail(
                user.email,
                product.name,
                product.image_url,
                oldPrice,
                newPrice
              );

              if (emailResult.success) {
                result.alertsSent++;
              }
            }
          }
        }

        result.updated++;
      } catch (err) {
        console.error("Product error:", err);
        result.failed++;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Cron completed",
      result,
    });
  } catch (error) {
    console.error("Cron error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// curl.exe -X POST http://localhost:3000/api/cron/check-price ^
// More?  -H "Authorization: Bearer 5c3a92d96374c7a8191c651136161e5ea444f65fe5a7abdd370308048e107d73"
