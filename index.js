import express from "express";
import bodyparser from "body-parser";
import cors from "cors";
// import handleContactForm from "./emailHandler.js";

const config = {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "ionutvasilca3@gmail.com",
        pass: "nnsaeimhvlxyvwar",
    },
};

import nodemailer from "nodemailer";

// const send = async (data) => {
//     const transporter = nodemailer.createTransport(config);
//     transporter.sendMail(data, (err, info) => {
//         if (err) {
//             console.log(err);
//         } else {
//             return info.response;
//         }
//     });
// };

const app = express();

app.use(
    cors({
        origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    })
);

app.use(
    bodyparser.urlencoded({
        limit: "500mb",
        extended: true,
    })
);
app.use(
    bodyparser.json({
        limit: "500mb",
    })
);

app.use(bodyparser.json());

app.post("/api/mail", async (req, res) => {
    try {
        const { from, sender, to, subject, text } = req.body;

        if (!sender) {
            return res.status(400).json({
                message: '"Email" trebuie completat',
            });
        }

        if (!subject) {
            return res.status(400).json({
                message: '"Subiect" trebuie completat',
            });
        }
        if (!text) {
            return res.status(400).json({
                message: '"Mesaj" trebuie completat',
            });
        }

        const data = { from, sender, to, subject, text };

        // await send(data);
        const transporter = nodemailer.createTransport(config);
        transporter.sendMail(data, (err, info) => {
            if (err) {
                return res.status(500).json({
                    message: "Email not sent",
                    error: `${err}`,
                });
            } else {
                return res.status(200).json({ message: "Email sent", data: info.response });
            }
        });

        // return res.status(200).json({
        //     message: "Mesaj trimis!",
        // });

    } catch (err) {
        return res.status(500).json({
            message: "Email not sent",
            error: `${err}`,
        });
    }
});

const port = process.env.PORT | 5000;

app.listen(port, () => {
    console.log(`Server started at http://127.0.0.1:${port}`);
});
