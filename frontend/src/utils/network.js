const baseURL = "/api/v1";

export const getData = async (path) => {
    try {
        const headers = { "Content-Type": "application/json" };

        const token = localStorage.getItem("token");
        if (token) headers.Authorization = `Bearer ${token}`;

        const response = await fetch(`${baseURL}${path}`, {
            method: "GET",
            headers,
        });

        return response.json();
    } catch (error) {
        return console.error(error);
    }
};

export const postData = async (path, body) => {
    try {
        const headers = {};
        const formData = new FormData();

        const data = Object.entries(body);
        data.map(([key, value]) => {
            if (key === "file") {
                for (let i = 0; i < value.length; ++i) {
                    const file = value[i];
                    formData.append(key, file, file.name);
                }
            }
            if (Array.isArray(value) || typeof value === 'object') {
                return formData.append(key, JSON.stringify(value));
            }
            return formData.append(key, value);
        });


        const token = localStorage.getItem("token");
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`${baseURL}${path}`, {
            method: "POST",
            headers,
            body: formData,
        });

        return response.json();
    } catch (error) {
        return console.error(error);
    }
};


export const uploadImage = async (photo) => {
    // const headers = { "Content-Type": "multipart/form-data>" };
    const formData = new FormData()

    // const token = localStorage.getItem("token");
    // if (token) headers["Authorization"] = `Bearer ${token}`;

    formData.append("file", photo, photo.name)

    console.log(photo)
    const response = await fetch(`${baseURL}/photos/create`, {
        method: "POST",
        // headers,
        body: formData,
    })


    if (!response.success) {
        if (!response.code) {
            response.code = "SOMETHING_WRONG";
        }
        if (!response.message) {
            response.message = response.code;
        }
    }

    return response.json();
};
