export class ResponseHelper {
  static success<T>(data: T, message: string = 'Success') {
    return {
      success: true,
      message,
      data,
    };
  }

  static error(message: string, errors?: any) {
    return {
      success: false,
      message,
      errors,
    };
  }

  static paginate<T>(
    data: T[],
    total: number,
    page: number,
    size: number,
  ) {
    return {
      data,
      pagination: {
        total,
        page,
        size,
        totalPages: Math.ceil(total / size),
      },
    };
  }
}
