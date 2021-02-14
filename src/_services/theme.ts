export async function getVendorTheme(appName: string, orgName: string, themeName: string) {
    try {
        let themeData = localStorage.getItem('theme_${appName}_${orgName}_${themeName}');
        let themeCurrentOrg = localStorage.getItem('themeCurrentOrg');

        if (!themeData || themeCurrentOrg != orgName) {
            await fetch('https://localhost:44369/api/org/${orgName}/theme/${themeName}', {
                    method: "GET"
                }).then(res => res.json())
                    .then(response => {
                        localStorage.setItem('theme_${appName}_${orgName}_${themeName}', response.data);
                        localStorage.setItem('themeCurrentOrg', orgName);
                        return response.data;
                    }
                );
        } else {
            return themeData;
        }
    }
    catch (e) {
        return '';
    }
}