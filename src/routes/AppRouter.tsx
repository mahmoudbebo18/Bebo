import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
const MainLayout = lazy(() => import('../layouts/MainLayout/MainLayout'));
const Home = lazy(() => import('../pages/Home'))
const About = lazy(() => import('../pages/About'))
const Products = lazy(() => import('../pages/Products'))
const Login = lazy(() => import('../pages/Login'))
const Register = lazy(() => import('../pages/Register'))
const Cart = lazy(() => import('../pages/Cart'))
const Wishlist = lazy(() => import('../pages/Wishlist'))
const Categories = lazy(() => import('../pages/Categories'))
const Profile = lazy(() => import('../pages/Profile'))
const Checkout = lazy(() => import('../pages/Checkout'))
const Payment = lazy(() => import('../pages/Payment'))
import Error from '../pages/404'
import PageSuspenseFallback from '../components/feedback/PageSuspenseFallback/PageSuspenseFallback';
import ProtectedRoute from '../components/AuthGard/ProtectedRoute';


const router = createBrowserRouter([
    {
        path: "/",
        element: <Suspense fallback={
            <div className='d-flex align-items-center flex-column'>
                <h5 style={{ marginTop: "20%" }}> Loading please wait.... </h5>
            </div>
        }>
            <MainLayout />
        </Suspense>,
        errorElement: <Error />,
        children: [
            {
                index: true,
                element: (
                    <PageSuspenseFallback>
                        <Home />
                    </PageSuspenseFallback>
                )
            },
            {
                path: "about",
                element: (
                    <PageSuspenseFallback>
                        <About />
                    </PageSuspenseFallback>
                )
            },
            {
                path: "categories",
                element: (
                    <PageSuspenseFallback>
                        <Categories />
                    </PageSuspenseFallback>
                )
            },

            {
                path: "products/:prefix",
                element: (
                    <PageSuspenseFallback>
                        <Products />
                    </PageSuspenseFallback>
                ),
                loader: ({ params }) => {
                    if (
                        typeof params.prefix !== "string" ||
                        !/^[a-z]+$/i.test(params.prefix)
                    ) {
                        throw new Response("Bad Request", {
                            statusText: "Category not found",
                            status: 400,
                        });
                    }
                    return true;
                },
            },
            {
                path: "login",
                element: (
                    <PageSuspenseFallback>
                        < Login />
                    </PageSuspenseFallback>
                )
            },
            {
                path: "register",
                element: (
                    <PageSuspenseFallback>
                        <Register />
                    </PageSuspenseFallback>
                )
            },
            {
                path: "cart",
                element: (
                    <PageSuspenseFallback>
                        <Cart />
                    </PageSuspenseFallback>
                )
            },
            {
                path: "wishlist",
                element: (
                    <PageSuspenseFallback>
                        <Wishlist />
                    </PageSuspenseFallback>
                )
            },
            {
                path: "profile",
                element: (
                    <ProtectedRoute>
                        <PageSuspenseFallback>
                            <Profile />
                        </PageSuspenseFallback>
                    </ProtectedRoute>
                )
            },
            {
                path: "checkout",
                element: (
                    <ProtectedRoute>
                        <PageSuspenseFallback>
                            <Checkout />
                        </PageSuspenseFallback>
                    </ProtectedRoute>
                )
            },
            {
                path: "payment",
                element: (
                    <ProtectedRoute>
                        <PageSuspenseFallback>
                            <Payment />
                        </PageSuspenseFallback>
                    </ProtectedRoute>
                )
            },
        ]
    }
])

const AppRouter = () => {
    return (
        <RouterProvider router={router} />
    )
}

export default AppRouter
