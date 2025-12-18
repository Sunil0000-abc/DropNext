"use client";
import { Card, CardContent, CardFooter, CardHeader } from "./card";
import {
  Badge,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Link,
  Trash2,
  TrendingDown,
} from "lucide-react";
import { Button } from "./button";
import { useState } from "react";
import PriceChart from "./PriceChart";
import { deleteProduct } from "@/app/actions";

const ProductCard = ({ product }) => {
  const [showChart, setshowChart] = useState(false);
  const [loading, setloading] = useState(false);
  console.log(product);

  const handleDelete = async () => {
    if (!confirm("Remove this product from tracking?")) return;
    setloading(true);

    await deleteProduct(product.id);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex gap-4">
          {product.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.name}
              className="w-20 h-20 object-cover rounded-md border"
            />
          )}

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 text-[10px] md:text-[12px]">
              {product.name}
            </h3>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-orange-500 text-[15px]">
                {product.currency} {product.current_price}
              </span>
              <div>
                <button className="rounded-2xl text-[12px] flex items-center gap-2 border px-2">
                  <TrendingDown className="w-3 h-3" />
                  Tracking
                </button>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2 ">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setshowChart(!showChart)}
            className="gap-1 text-[10px] md:text-xs"
          >
            {showChart ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Hide Chart
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Show Chart
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="gap-1 text-[10px] md:text-xs"
            asChild
          >
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              View Product
            </a>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={loading}
            className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 "
          >
            <Trash2 className="w-4 h-4" />
            Remove
          </Button>
        </div>
      </CardContent>
      {showChart && (
        <CardFooter className="pt-0">
          <PriceChart productId={product.id} />
        </CardFooter>
      )}
    </Card>
  );
};

export default ProductCard;
