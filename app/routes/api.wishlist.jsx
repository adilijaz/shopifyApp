import { json } from "@remix-run/node";

export async function loader () {
    return json({
        name: "Whishlist Inspire",
        description: "Shopfy app development working directory."
    })
}

export async function action ({request}) {
    const method = request.method
    
    switch(method) {
        case "POST":
            
            return json({success: true, method: 'POST'})
        case "PATCH":
            return json({success: true, method: 'PATCH'})
        default:
            return json({success: false, method: 'Method not supported! ' + method})
    }
}