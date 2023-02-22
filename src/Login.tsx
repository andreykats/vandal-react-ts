import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UsersService, FormLogin, FormSignup } from './client'
import { useForm, SubmitHandler } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

export default function Login(): JSX.Element {
    const navigate = useNavigate()
    let [authMode, setAuthMode] = useState("signin")
    let [errorMessage, setErrorMessage] = useState("")

    // form validation rules 
    const signupValidationSchema = Yup.object().shape({
        username: Yup.string()
            .required('Email is required'),
        password: Yup.string()
            .required('Password is required')
            .min(6, 'Password must be at least 6 characters'),
        confirmPassword: Yup.string()
            .required('Confirm Password is required')
            .oneOf([Yup.ref('password')], 'Passwords must match')
    })
    const signupFormOptions = { resolver: yupResolver(signupValidationSchema) }

    // form validation rules 
    const loginValidationSchema = Yup.object().shape({
        username: Yup.string()
            .required('Email is required'),
        password: Yup.string()
            .required('Password is required')
            .min(6, 'Password must be at least 6 characters'),
    })
    const loginFormOptions = { resolver: yupResolver(loginValidationSchema) }

    const { register: registerLogin, handleSubmit: handleLogin, formState: loginState } = useForm<FormLogin>(loginFormOptions)
    const { register: registerSignup, handleSubmit: handleSignup, formState: signupState } = useForm<FormSignup>(signupFormOptions)
    const { errors: loginErrors } = loginState
    const { errors: signupErrors } = signupState
    const onLogin: SubmitHandler<FormLogin> = login
    const onSignup: SubmitHandler<FormSignup> = signup

    async function login(form: FormLogin) {
        // event.preventDefault()
        var formData = {} as FormLogin
        formData.username = form.username
        formData.password = form.password

        try {
            const response = await UsersService.usersLogin(formData)
            console.log("Login response: ", response)
            localStorage.setItem('token', response.access_token)
            selectHome()
        } catch (error: any) {
            console.dir(error)
            loginErrors.username = error.body.detail
            setErrorMessage(error.body.detail)
            // alert("Login error: " + error.body.detail)
        }
    }

    async function signup(form: FormSignup) {
        var formData = {} as FormSignup
        formData.username = form.username
        formData.password = form.password
        formData.confirmPassword = form.confirmPassword

        try {
            const response = await UsersService.usersSignup(formData)
            console.log("Signup response: ", response)
            setAuthMode("success")
        } catch (error: any) {
            console.dir(error)
            loginErrors.username = error.body.detail
            setErrorMessage(error.body.detail)
        }
    }

    function selectHome() {
        navigate("/")
        window.location.reload()
    }

    const changeAuthMode = () => {
        setAuthMode(authMode === "signin" ? "signup" : "signin")
    }

    if (authMode === "success") {
        return (
            <div className="Auth-form-container">
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">Succesfully Registered!</h3>
                    <div className="d-grid gap-2 mt-3">
                        <button type="submit" className="btn btn-primary" onClick={() => setAuthMode("signin")}>
                            Login
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (authMode === "signin") {
        return (
            <div className="Auth-form-container">
                <form className="Auth-form" onSubmit={handleLogin(onLogin)}>
                    <div className="Auth-form-content">
                        <h3 className="Auth-form-title">Sign In</h3>
                        <div className="text-center">
                            Not registered yet?{" "}
                            <span className="link-primary" onClick={changeAuthMode}>
                                Sign Up
                            </span>
                        </div>
                        <div className="form-group mt-3">
                            <label>Email address</label>
                            <input
                                type="email"
                                className={`form-control ${loginErrors.username ? 'is-invalid' : ''} ${errorMessage ? 'is-invalid' : ''}`}
                                placeholder="Enter email address"
                                {...registerLogin("username")}
                            />
                            <div className="invalid-feedback">{errorMessage}</div>
                            <div className="invalid-feedback">{loginErrors.username?.message}</div>
                        </div>

                        <div className="form-group mt-3">
                            <label>Password</label>
                            <input
                                type="password"
                                className={`form-control ${loginErrors.password ? 'is-invalid' : ''}`}
                                placeholder="Enter password"
                                {...registerLogin("password")}
                            />
                            <div className="invalid-feedback">{loginErrors.password?.message}</div>
                        </div>
                        <div className="d-grid gap-2 mt-3">
                            <button type="submit" className="btn btn-primary">
                                Submit
                            </button>
                        </div>
                        <p className="text-center mt-2">
                            Forgot <a href="#">password?</a>
                        </p>
                    </div>
                </form>
            </div>
        )
    }

    return (
        <div className="Auth-form-container">
            <form className="Auth-form" onSubmit={handleSignup(onSignup)}>
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">Sign Up</h3>
                    <div className="text-center">
                        Already registered?{" "}
                        <span className="link-primary" onClick={changeAuthMode}>
                            Sign In
                        </span>
                    </div>
                    <div className="form-group mt-3">
                        <label>Email address</label>
                        <input
                            type="email"
                            className={`form-control ${signupErrors.username ? 'is-invalid' : ''} ${errorMessage ? 'is-invalid' : ''}`}
                            placeholder="Email Address"
                            {...registerSignup("username")}
                        />
                        <div className="invalid-feedback">{errorMessage}</div>
                        <div className="invalid-feedback">{signupErrors.username?.message}</div>
                    </div>
                    <div className="form-group mt-3">
                        <label>Password</label>
                        <input
                            type="password"
                            className={`form-control ${signupErrors.password ? 'is-invalid' : ''}`}
                            placeholder="Password"
                            {...registerSignup("password")}
                        />
                        <div className="invalid-feedback">{signupErrors.password?.message}</div>
                    </div>
                    <div className="form-group mt-3">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            className={`form-control ${signupErrors.confirmPassword ? 'is-invalid' : ''}`}
                            placeholder="Password"
                            {...registerSignup('confirmPassword')}
                        />
                        <div className="invalid-feedback">{signupErrors.confirmPassword?.message}</div>
                    </div>
                    <div className="d-grid gap-2 mt-3">
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    </div>
                    <p className="text-center mt-2">
                        Forgot <a href="#">password?</a>
                    </p>
                </div>
            </form>
        </div >
    )
}