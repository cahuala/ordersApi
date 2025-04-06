class AppError{
    message:string
    statusCod:number

    constructor(message: string, statusCode:number=400){
        this.message=message
        this.statusCod=statusCode
    }
}

export { AppError }