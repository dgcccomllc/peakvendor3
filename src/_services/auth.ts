export async function requestJWT(appName: string, orgName: string) {
    try {
        let token = '';

            //localStorage.getItem('jwt${appName}${orgName}');

        if (!token) {
            let header = {
                "P15App": appName,
                "P15Org": orgName
            }

            await fetch('https://localhost:44369/api/Token/GetStaticToken', {
                method: "GET",
                headers: header
            }).then(res => res.json())
                .then(response => {
                    token = response.data;
                    localStorage.setItem('jwt${appName}${orgName}', response.data);
                    token = ('bearer ' + token).toString();
                }
                );
        }

        return token;
    }
    catch (e) {
        return '';
    }
}