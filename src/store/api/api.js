function environmentType(environment){
    const env = "Production"
    if(environment.toLowerCase() == env.toLowerCase()){
        return "https://formify-node-3kzc.onrender.com"
    } else {
        return "http://localhost:5000"
    }
}

export const BASE_URL = environmentType("Production")