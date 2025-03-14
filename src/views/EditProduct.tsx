import { Link, Form, useActionData, ActionFunctionArgs, redirect,LoaderFunctionArgs, useLoaderData } from "react-router-dom"
import ErrorMessage from "../components/ErrorMessage";
import { getProductById, updateProduct } from "../services/ProductService";
import { Product } from "../types";

export async function loader({ params }: LoaderFunctionArgs) {
    if (params.id !== undefined) {
        const product = await getProductById(+params.id);
        console.log(product);
        if (!product) {
            throw new Response('', {
                status: 404,
                statusText: 'Product not found'
            });
        }
        return product;
    }
}

export async function action({ request, params }: ActionFunctionArgs) {
    const data = Object.fromEntries(await request.formData());

    let error = '';

    if (Object.values(data).includes('')) {
        error = 'Please complete the fields'
    }

    if (error.length) {
        return error
    }

    if (params.id !== undefined) {
        await updateProduct(data, +params.id);
        return redirect('/')

    }

}

const availabilityOptions = [
    { name: 'Available', value: true },
    { name: 'Not available', value: false }
]

export default function EditProduct() {

    const error = useActionData() as string;
    // const location = useLocation();
    // console.log(location.state);
    const product = useLoaderData() as Product;

    console.log(error);

    return (
        <>
            <div className="flex justify-between">
                <h2 className="text-4xl font-black text-slate-500">Edit product</h2>
                <Link
                    to={"/"}
                    className="rounded-md bg-indigo-600 p-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-500">
                    Back to Inventory
                </Link>
            </div>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <Form
                className="mt-10"
                method="POST">
                <div className="mb-4">
                    <label
                        className="text-gray-800"
                        htmlFor="name"
                    >Product Name:</label>
                    <input
                        id="name"
                        type="text"
                        className="mt-2 block w-full p-3 bg-gray-50"
                        placeholder="Product name"
                        name="name"
                        // defaultValue={location.state.product.name}
                        defaultValue={product.name}
                    />
                </div>
                <div className="mb-4">
                    <label
                        className="text-gray-800"
                        htmlFor="price"
                    >Price:</label>
                    <input
                        id="price"
                        type="number"
                        className="mt-2 block w-full p-3 bg-gray-50"
                        placeholder="Product price. ej. 200, 300"
                        name="price"
                        // defaultValue={location.state.product.price}
                        defaultValue={product.price}
                    />
                </div>

                <div className="mb-4">
                    <label
                        className="text-gray-800"
                        htmlFor="availability"
                    >Availability:</label>
                    <select
                        id="availability"
                        className="mt-2 block w-full p-3 bg-gray-50"
                        name="availability"
                        defaultValue={product?.availability.toString()}
                    >
                        {availabilityOptions.map(option => (
                            <option key={option.name} value={option.value.toString()}>{option.name}</option>
                        ))}
                    </select>
                </div>

                <input
                    type="submit"
                    className="mt-5 w-full bg-indigo-600 p-2 text-white font-bold text-lg cursor-pointer rounded"
                    value="Save"
                />
            </Form>
        </>
    )
}
