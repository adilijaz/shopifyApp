import { json } from "@remix-run/node";
import db from "../db.server";
import { cors } from "remix-utils/cors";


export async function loader ({request}) {
    const url = new URL(request.url);
    const customerId = url.searchParams.get("customerId");
    const shop = url.searchParams.get("shop");
    const productId = url.searchParams.get("productId");
  
  
    if(!customerId || !shop || !productId) {
      return json({
        message: "Missing data. Required data: customerId, productId, shop",
        method: "GET"
      });
    }
  
    
    const wishlist = await db.whishlist.findMany({
      where: {
        customerId: customerId,
        shop: shop,
        productId: productId,
      },
    });
  
  
    const response = json({
      ok: true,
      message: "Success",
      data: wishlist,
    });
  
    return cors(request, response);
}

export async function action ({request}) {
    const method = request.method
    let data = await request.formData();
    data = Object.fromEntries(data);
    const customerId = data.customerId;
    const productId = data.productId;
    const shop = data.shop;
    const _action = data._action;  
    if(!customerId || !productId || !shop || !_action) {
        return json({
            message: "Missing data. Required data: CustomerId, ProductId, Shop & _action",
            method: method,
        })
    }

    let response;

    switch(_action) {
        case "CREATE":
            const whishlist = await db.whishlist.create({
                data:{
                    customerId,
                    productId,
                    shop,
                },
            });
            response = json({message:"Product Added To Whishlist!", method: _action, whishlist: whishlist});
            return cors(request, response)
        case "PATCH":
            return json({success: true, method: 'PATCH'})

        case "DELETE":
            // Handle DELETE request logic here (Not tested)
            // For example, removing an item from the wishlist
            await db.whishlist.deleteMany({
                where: {
                customerId: customerId,
                shop: shop,
                productId: productId,
                },
            });
        
            response = json({ message: "Product removed from your wishlist", method: _action, wishlisted: false });
            return cors(request, response);
        default:
            return json({success: false, method: 'Method not supported! ' + method})
    }
}