import queryString from "query-string";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const baseURL = process.env.REACT_APP_BASE_URL;
const serverURL = process.env.REACT_APP_SERVER_URL;

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    // google login
    const handleAuthRedirect = async () => {
        if (location.pathname === "/auth/google") {
            try {
                const { code } = queryString.parse(location.search);

                const URL = serverURL + `/auth/google?code=${code}&redirectUri=${baseURL}/auth/google`;
                const response = await fetch(URL, {
                    method: 'POST',
                });
                const data = await response.json();
                console.log(data);
                localStorage.setItem('user', JSON.stringify(data.data));
                localStorage.setItem('token', JSON.stringify(data.token));
                navigate("/");

            } catch (error) {
                console.error('Error fetching auth data:', error);
            }
        }
    };

    const googleLogin = async () => {
        const queryParams = queryString.stringify({
            client_id: process.env.REACT_APP_CLIENT_ID, // It must correspond to what we declared earlier in the backend
            scope: "email profile", // This is the user data you have access to, in our case its just the mail.
            redirect_uri: baseURL + "/auth/google", // This is the uri that will be redirected to if the user signs into his google account successfully
            // auth_type: "rerequest", // This tells the consent screen to reappear if the user initially entered wrong credentials into the google modal
            display: "popup", //It pops up the consent screen when the anchor tag is clicked
            response_type: "code", // This tells Google to append code to the response which will be sent to the backend which exchange the code for a token
            // prompt: "consent" // This tells google to always show the consent screen
        });
        const url = `https://accounts.google.com/o/oauth2/v2/auth?${queryParams}`;
        
        window.location.href = url;
    }

    useEffect(() => {
        if (location.pathname === "/auth/google") {
            handleAuthRedirect()
        }

    }, [location.pathname]);

    return (
        <div >
            <div className="shadow border px-5 py-4 bg-white rounded w-400">
                <form>
                    <p className="text-success pb-4 fs-3 fw-bold text-center">LOGIN TO YOUR ACCOUNT</p>
                    {
                        error &&
                        <div className="alert alert-danger fw-bold" role="alert">{error}. Try again.</div>
                    }
                    <div className="d-flex flex-column pb-3">
                        <label className="form-label fw-bold" htmlFor="email">Email address</label>
                        <input
                            className="form-control border-0 bg-body-secondary shadow-none"
                            id="email"
                            type="text"
                            placeholder="you@example.com"
                            onChange={e => setEmail(e.target.value)}
                            autoComplete="on"
                            required
                        />
                    </div>
                    <div className="d-flex flex-column pb-3">
                        <label className="form-label fw-bold" htmlFor="password">Password</label>
                        <input
                            className="form-control border-0 bg-body-secondary shadow-none"
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            onChange={e => setPassword(e.target.value)}
                            autoComplete="on"
                            required
                        />
                    </div>
                    <div className="d-flex justify-content-center mt-3">
                        <input
                            type="submit"
                            value="Login"
                            className="bg-success text-white border-0 rounded-pill px-5 py-2"
                        />
                    </div>
                </form>
                <div className="d-flex justify-content-center my-3">
                    <button
                        className="btn btn-light border shadow-sm  w-100 d-flex align-items-center justify-content-center"
                        onClick={googleLogin}
                    >
                        <img className="user-avatar" src="/img/google-logo.png" />
                        <span className="ps-2">Sign in with google</span>
                    </button>
                </div>
            </div>
        </div>
    )
}