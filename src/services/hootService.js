const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/hoots`;

const index = async () => {
    try {
        // config 
        const res = await fetch(BASE_URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}`},
        });
        return res.json();
    } catch (error) {
        console.log(error);
    }
}

const show = async (hootId) => {
    try {  //need config object, bc this is protected
        const res = await fetch(`${BASE_URL}/${hootId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return res.json();
    } catch (error) {
        console.log(error);
    }
}

export { index, show }; // name export syntax, (used to export multiple function )