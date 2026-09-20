const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { OAuth2Client } = require("google-auth-library");

const User = require("./models/User");

const app = express();

app.use(cors());
app.use(express.json());

const googleClient =
    new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.log("MongoDB error:", error);
    });


app.get("/", (req, res) => {

    res.json({
        message: "Express is working!"
    });

});


app.post("/auth/google", async (req, res) => {

    try {

        const { credential } = req.body;

        const ticket =
            await googleClient.verifyIdToken({

                idToken: credential,

                audience:
                    process.env.GOOGLE_CLIENT_ID

            });

        const payload = ticket.getPayload();

        const googleId = payload.sub;
        const email = payload.email;
        const name = payload.name;
        const profilePicture = payload.picture;


        let user = await User.findOne({
            email: email
        });


        if (!user) {

            user = await User.create({

                googleId: googleId,

                name: name,

                email: email,

                profilePicture: profilePicture

            });

            console.log("New user created!");

        }


        res.json({

            message: "Login successful",

            user: user

        });


    } catch (error) {

        console.log(error);

        res.status(401).json({

            message: "Google authentication failed"

        });

    }

});


app.listen(5000, () => {

    console.log("Server running on port 5000");

});
