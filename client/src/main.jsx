import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";

function App() {

    useEffect(() => {

        window.google.accounts.id.initialize({

            client_id:
                "253639776026-5e9ccnmqtsbk93pokne0mgeajg50govv.apps.googleusercontent.com",

            callback: handleGoogleLogin

        });


        window.google.accounts.id.renderButton(

            document.getElementById(
                "googleButton"
            ),

            {
                theme: "outline",
                size: "large"
            }

        );

    }, []);


    async function handleGoogleLogin(response) {

        console.log("Google login successful");

        const result = await fetch(
            "http://localhost:5000/auth/google",
            {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    credential:
                        response.credential

                })

            }
        );


        const data =
            await result.json();


        console.log(data);

    }


    return (

        <div>

            <h1>My Login Application</h1>

            <div id="googleButton"></div>

        </div>

    );

}


ReactDOM.createRoot(
    document.getElementById("root")
).render(

    <React.StrictMode>

        <App />

    </React.StrictMode>

);
