import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loginAuth, resetUI } from "../store/auth/authSlice";
import { useSearchParams, useNavigate, Navigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form"
import { loginSchema, loginType } from "../validations/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Button, Col, Row, Alert, Spinner } from 'react-bootstrap';
import Input from "../components/Form/Input/Input";
const Login = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error, accessToken } = useAppSelector(state => state.auth)
    const [searchParams, setSearchParams] = useSearchParams()

    const message = searchParams.get('message')
    const { register, handleSubmit, formState: { errors } } = useForm<loginType>({
        mode: "onBlur", // this will run the validation onBlur
        resolver: zodResolver(loginSchema)
    })
    const submitForm: SubmitHandler<loginType> = (data) => {
        if (message) {
            setSearchParams("")
        }
        dispatch(loginAuth(data)).unwrap().then(() => {
            navigate('/')
        })
    }

    useEffect(() => {
        return () => {
            dispatch(resetUI())
        }
    }, [dispatch])

    // protect the login route

    if (accessToken) {
        return <Navigate to="/" />
    }
    return (
        <>
            <h1> Login </h1>
            <Row>

                <Col md={{ span: 6, offset: 3 }}>
                    {message === "account_created" && <Alert variant="success">Account successfully created</Alert>}
                    {message === "login_required" && <Alert variant="info">You need to login first</Alert>}
                    <Form onSubmit={handleSubmit(submitForm)}>
                        <Input
                            label="Email"
                            register={register}
                            name="email"
                            error={errors.email?.message}
                        />
                        <Input
                            label="Password"
                            register={register}
                            name="password"
                            type="password"
                            error={errors.password?.message}
                        />
                        <Button variant="info" type="submit" className='text-white'>
                            {loading === "pending" ?
                                <>
                                    <Spinner animation="border" size="sm" />
                                    <span className="ms-2"> Submitting </span>
                                </>
                                : 'Submit'}
                        </Button>
                        {error && <Alert className="mt-2" variant="danger">{error}</Alert>}
                    </Form>
                </Col>
            </Row>
        </>
    )
}
export default Login
