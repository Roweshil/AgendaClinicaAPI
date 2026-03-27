    // Base para google OAuth (deshabilitada temporalmente para pruebas)
    
    /*async googleLogIn(googleToken: any): Promise<any> {

        const client = new OAuth2Client('743936446182-72k4bdhtljlkeuuvbjgfu2df9c3dr6te.apps.googleusercontent.com')

        const ticket = await client.verifyIdToken({
            idToken: googleToken.token,
            audience: '743936446182-72k4bdhtljlkeuuvbjgfu2df9c3dr6te.apps.googleusercontent.com',
        })

        if (!ticket) throw new AxiosError('Algo salió mal')

        let payload = ticket.getPayload();

        // console.log(payload);


        const busquedaUsuario = await this.usuariosService.buscarPorCorreo(payload.email);

        if (!busquedaUsuario) {
            //Guardar en BD
            let newUser = new UsuarioDto();
            newUser.correo = payload.email
            newUser.nombre = payload.name
            newUser.apellidoPaterno = payload.family_name
            newUser.foto = payload.picture
            const createdUser = await this.usuariosService.createUser(newUser);

            console.log('Nuevo usuario registrado: ', createdUser.correo);
        }

        // if (!busquedaUsuario.esAdministrador) {
        //     console.log('Acceso denegado: ', payload);

        //     return new HttpException('Este usuario no tiene permisos', HttpStatus.FORBIDDEN);
        // }

        let newPayload = {
            fotoPerfil: payload.picture,
            nombre: payload.given_name,
            apellido: payload.family_name,
            correo: payload.email,
            isLogged: true
        };

        console.log('inició sesión: ', newPayload.correo);


        return {
            access_token: await this.jwtService.signAsync(newPayload),

            // sesion: newPayload
        };
    }

    async AsyncGetUserFromRequest(request: Request) {
        
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        if(type !== 'Bearer' || !token) return undefined;

        const decrypted = await this.jwtService.decode(token)
        delete decrypted.iat
        delete decrypted.exp

        const user:Sesion = decrypted

        return user
 

    }*/



        /*

"start": {
 "dateTime": "2015-09-15T06:00:00+02:00",
 "timeZone": "Europe/Zurich"
},
"end": {
 "dateTime": "2015-09-15T07:00:00+02:00",
 "timeZone": "Europe/Zurich"
},
"recurrence": [
 "RRULE:FREQ=WEEKLY;COUNT=5;BYDAY=TU,FR"
], */