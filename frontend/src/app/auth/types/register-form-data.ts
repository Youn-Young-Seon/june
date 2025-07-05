import RegisterData from './register-data';

type RegisterFormData = RegisterData & {
    confirmPassword: string;
}

export default RegisterFormData;