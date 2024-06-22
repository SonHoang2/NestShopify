import { useEffect, useState } from "react";

export default function Home() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [email, setEmail] = useState("");
    
    useEffect(() => {
        if (user) {
            setEmail(user.email);
        }
    }, []);
    return (
        <div>
            <h1>Home</h1>
            <p>Welcome to the Home page!</p>
            {
                email && <h1>Hi {email} </h1>
            }
            <a href="/login">Login</a>
        </div>
    );
}