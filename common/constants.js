function getCookie(cname) {
    var name = cname;
    if (typeof window !== "undefined") {
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(";");
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == " ") {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length + 1, c.length);
            }
        }
    }
    return '';
}

const authtoken = env => {
    let authtoken = getCookie("token");
    return authtoken;
};

const shopOrigin = env => {
    let shopOrigin = getCookie("shopOrigin");
    return shopOrigin;
};

const shopid = env => {
    let shopid = getCookie("shopid");
    return shopid;
};


export const constants = Object.freeze({
    AUTHTOKEN : authtoken(" "),
    SHOPORIGIN : shopOrigin(" "),
    SHOPID      : shopid(" ")
});

export const {AUTHTOKEN} =constants;
export const {SHOPORIGIN} =constants;
export const {SHOPID} = constants;
export default constants;