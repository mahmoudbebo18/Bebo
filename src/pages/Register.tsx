import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { registrationAuth, resetUI } from "../store/auth/authSlice";
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, signUpType } from "../validations/registerSchema";
import Input from "../components/Form/Input/Input";
import { Form, Button, Col, Row, Spinner } from 'react-bootstrap';
import useCheckEmailAvailability from "../hooks/useCheckEmailAvailability";
import { useNavigate, Navigate } from "react-router-dom";

type TFormInputs = signUpType

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { loading, error, accessToken } = useAppSelector((state) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
        getFieldState,
    } = useForm<TFormInputs>({
        mode: "onBlur",
        resolver: zodResolver(registerSchema),
    });

    const {
        emailAvailabilityStatus,
        enteredEmail,
        checkEmailAvailability,
        resetCheckEmailAvailability,
    } = useCheckEmailAvailability();

    const sunbmitForm: SubmitHandler<TFormInputs> = (data) => {
        const { firstName, lastName, email, password } = data;
        dispatch(registrationAuth({ firstName, lastName, email, password }))
            .unwrap()
            .then(() => {
                navigate("/login?message=account_created");
            });
    };

    const onBlurHandler = async (e: React.FocusEvent<HTMLInputElement>) => {
        const value = e.target.value;
        await trigger("email");
        const { isDirty, invalid } = getFieldState("email");
        if (isDirty && !invalid && enteredEmail !== value) {
            checkEmailAvailability(value);
        }
        if (isDirty && invalid && enteredEmail) {
            resetCheckEmailAvailability();
        }
    };

    useEffect(() => {
        return () => {
            dispatch(resetUI());
        };
    }, [dispatch]);

    if (accessToken) {
        return <Navigate to="/" />;
    }

    return (
        <>
            <h1>Register</h1>
            <Row>
                <Col md={{ span: 6, offset: 3 }}>
                    <Form onSubmit={handleSubmit(sunbmitForm)}>
                        <Input
                            label="First Name"
                            register={register}
                            name="firstName"
                            error={errors.firstName?.message}
                        />
                        <Input
                            label="Last Name"
                            register={register}
                            name="lastName"
                            error={errors.lastName?.message}
                        />
                        <Input
                            label="Email address"
                            register={register}
                            name="email"
                            onBlur={onBlurHandler}
                            error={
                                errors.email?.message
                                    ? errors.email?.message
                                    : emailAvailabilityStatus === "notAvailable"
                                        ? "This email is already in use."
                                        : emailAvailabilityStatus === "failed"
                                            ? "Error from the server."
                                            : ""
                            }
                            formText={
                                emailAvailabilityStatus === "checking"
                                    ? "We're currently checking the availability of this email address. Please wait a moment."
                                    : ""
                            }
                            success={
                                emailAvailabilityStatus === "available"
                                    ? "This email is available for use."
                                    : ""
                            }
                            disabled={emailAvailabilityStatus === "checking"}
                        />
                        <Input
                            label="Password"
                            register={register}
                            name="password"
                            type="password"
                            error={errors.password?.message}
                        />
                        <Input
                            label="Confirm Password"
                            register={register}
                            name="confirmPassword"
                            type="password"
                            error={errors.confirmPassword?.message}
                        />
                        
                        <Button
                            disabled={emailAvailabilityStatus === "checking" || loading === "pending"}
                            variant="info"
                            type="submit"
                            className="text-white"
                        >
                            {loading === "pending" ? (
                                <>
                                    <Spinner animation="border" size="sm" />
                                    <span className="ms-2">Submitting</span>
                                </>
                            ) : (
                                "Submit"
                            )}
                        </Button>
                        {error && <p className="text-danger mt-3">{error}</p>}
                    </Form>
                </Col>
            </Row>
        </>
    );
};

export default Register;