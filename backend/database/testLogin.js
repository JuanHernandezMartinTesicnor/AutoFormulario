const http = require("http");

function request(options, body = null) {

    return new Promise((resolve, reject) => {

        const req = http.request(
            options,
            res => {

                let data = "";

                res.on("data", chunk => {
                    data += chunk;
                });

                res.on("end", () => {

                    resolve({
                        status: res.statusCode,
                        headers: res.headers,
                        body: data
                    });

                });

            }
        );

        req.on("error", reject);

        if (body) {
            req.write(body);
        }

        req.end();

    });

}


async function test() {

    console.log("Probando login...\n");


    const loginData = JSON.stringify({
        email: "jesus@tesicnor.com",
        password: "Prueba123!"
    });


    const login = await request({

        hostname: "localhost",

        port: 3000,

        path: "/api/auth/login",

        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "Content-Length":
                Buffer.byteLength(loginData)
        }

    }, loginData);


    console.log("Respuesta login:");

    console.log("Status:", login.status);

    console.log("Body:", login.body);

    console.log(
        "\nSet-Cookie:",
        login.headers["set-cookie"]
    );


    if (
        !login.headers["set-cookie"] ||
        login.status !== 200
    ) {

        console.log(
            "\n❌ El login no ha creado la sesión."
        );

        return;

    }


    /*
     * Extraemos la cookie de sesión.
     */

    const cookie =
        login.headers["set-cookie"][0]
            .split(";")[0];


    console.log(
        "\nCookie de sesión:",
        cookie
    );


    /*
     * Ahora preguntamos quién está conectado.
     */

    const me = await request({

        hostname: "localhost",

        port: 3000,

        path: "/api/auth/me",

        method: "GET",

        headers: {
            Cookie: cookie
        }

    });


    console.log("\nRespuesta /me:");

    console.log("Status:", me.status);

    console.log("Body:", me.body);


    if (me.status === 200) {

        console.log(
            "\n✅ AUTENTICACIÓN FUNCIONANDO CORRECTAMENTE"
        );

    } else {

        console.log(
            "\n❌ La sesión no se ha recuperado correctamente."
        );

    }

}


test().catch(error => {

    console.error(
        "\nError durante la prueba:",
        error
    );

});