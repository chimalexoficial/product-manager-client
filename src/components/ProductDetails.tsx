import { deleteProduct } from "../services/ProductService";
import { Product } from "../types"
import { formatCurrency } from "../utils"
import { Form, ActionFunctionArgs, Link, useNavigate, redirect } from "react-router-dom";

type ProductDetailsProps = {
    product: Product
}

export async function action({ params }: ActionFunctionArgs) {
    if (params.id !== undefined) {
        await deleteProduct(+params.id);
        return redirect('/');
    }

}
export default function ProductDetails({ product }: ProductDetailsProps) {

    const isAvailable = product.availability;
    const navigate = useNavigate();

    return (
        <tr className="border-b ">
            <td className="p-3 text-lg text-gray-800">
                {product.name}
            </td>
            <td className="p-3 text-lg text-gray-800">
                {formatCurrency(product.price)}
            </td>
            <td className="p-3 text-lg text-gray-800">
                {isAvailable ? 'Available' : 'Not available'}
            </td>
            <td className="p-3 text-lg text-gray-800 ">
                <div className="flex gap-2 items-center">
                    {/* <Link
                        className="bg-indigo-600 text-white rounded-lg w-full p-2 uppercase font-bold text-xs text-center"
                        to={`/products/${product.id}/edit`}>Edit</Link> */}
                    <button
                        className="bg-indigo-600 text-white rounded-lg w-full p-2 uppercase font-bold text-xs text-center"
                        onClick={() => navigate(`/products/${product.id}/edit`,
                            //     {
                            //     state: {
                            //         product
                            //     }
                            // }
                        )}> Edit product
                    </button>

                    <Form
                        method="POST"
                        action={`products/${product.id}/delete`}
                        onSubmit={(e) => {
                            if (!confirm('Delete product?'))
                                e.preventDefault()
                        }}>
                        <input
                            className="bg-red-600 text-white rounded-lg w-full p-2 uppercase font-bold text-xs text-center"
                            type="submit"
                            value={'Delete'}
                        />
                    </Form>
                </div>
            </td>
        </tr>
    )
}
