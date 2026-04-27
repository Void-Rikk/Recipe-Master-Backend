export class ValidationError extends Error {
    constructor(message) {
        super(message);
    }
}

export function validateAuth(first_name, last_name, password) {
    if (!first_name || !last_name || !password) {
        throw new ValidationError("Missing required fields");
    }
    else if (first_name.length < 2) {
        throw new ValidationError("First name must contain at least 2 characters");
    }
    else if (last_name.length < 2) {
        throw new ValidationError("Last name must contain at least 2 characters");
    }
    else if (password.length < 8) {
        throw new ValidationError("Password must contain at least 8 characters");
    }
}