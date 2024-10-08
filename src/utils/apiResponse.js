class APIResponse{
    constructor(
        statusCode,
        data,
        message="Request Successfull",

    ){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;

    }
}

export default APIResponse;